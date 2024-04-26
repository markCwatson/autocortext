import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import DocService from '@/services/DocService';
import { FILE, FOLDER, TROUBLESHOOT } from '@/lib/constants';
import { Pinecone } from '@pinecone-database/pinecone';
import { deletePineconeVectors } from '@/lib/pinecone';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const type = url.searchParams.get('type');
  if (!companyId || !type) {
    return new Response('Company ID and type required', { status: 400 });
  }

  if (type === FILE) {
    try {
      const { name, parentId, parentPath } = await req.json();

      const doc = await DocService.create({
        name, // name is used as key on AWS S3
        companyId,
        parentId: parentId as string,
        type: FILE,
        parentPath: parentPath as string,
      });
      if (!doc) {
        return NextResponse.json(
          { error: 'Error creating file in the database' },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 },
      );
    }
  } else if (type === FOLDER) {
    const { name, parentId, parentPath, path } = await req.json();
    if (!name || !parentId || !parentPath || !path) {
      return NextResponse.json(
        { error: 'Name, parentId, parentPath, and path are required' },
        { status: 400 },
      );
    }

    const doc = await DocService.create({
      name,
      parentId,
      parentPath,
      companyId,
      type: FOLDER,
    });
    if (!doc) {
      return NextResponse.json(
        { error: 'Error creating folder in the database' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } else if (type === TROUBLESHOOT) {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // checkout for /troubleshooting folder (create it if it doesn't exist)
    const docs = await DocService.getAllByCompanyId(companyId);
    const rootFolder = docs.find((doc) => doc.parentId === null);
    let troubleshootingFolder = docs.find(
      (doc) => doc.name === 'troubleshooting',
    );
    if (!troubleshootingFolder) {
      const doc = await DocService.create({
        name: 'troubleshooting',
        companyId: companyId,
        parentId: rootFolder!._id.toString(),
        parentPath: '/',
        type: FOLDER,
      });
      if (!doc) {
        return NextResponse.json(
          { error: 'Error creating troubleshooting folder in the database' },
          { status: 500 },
        );
      }
      troubleshootingFolder = doc;
    }

    // add conversation to /troubleshooting folder
    const doc = await DocService.create({
      name: name,
      parentId: troubleshootingFolder._id.toString(),
      parentPath: troubleshootingFolder.path,
      companyId: companyId,
      type: FILE,
    });
    if (!doc) {
      return NextResponse.json(
        { error: 'Error creating conversation in the database' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return new Response('Company ID required', { status: 400 });
  }

  const docs = await DocService.getAllByCompanyId(companyId);
  if (!docs) {
    return new Response('Failed to fetch documents', { status: 500 });
  }

  const docTree = DocService.generateTreeFromList(docs);
  return NextResponse.json(docTree);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const docId = url.searchParams.get('docId');
  const type = url.searchParams.get('type');
  if (!companyId || !docId || !type) {
    return new Response('Company ID, document ID, and type are required', {
      status: 400,
    });
  }

  const doc = await DocService.getDocById(docId);
  if (!doc) {
    return new Response('Document not found', { status: 404 });
  }

  if (type !== FILE && type !== FOLDER) {
    return new Response('Invalid document type', { status: 400 });
  }

  if (type === FILE) {
    // delete file from S3
    const s3Client = new S3Client({
      region: process.env.NEXT_AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
      },
    });

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
        Key: doc.name,
      }),
    );

    // delete indexes from Pinecone
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });

    const indexName = await DocService.getIndexByDocName(doc.name);
    if (indexName) {
      await deletePineconeVectors({
        client,
        indexName,
        prefix: doc.name,
      });
    }
  }

  const deleted = await DocService.delete({
    companyId,
    docId,
    type: type as typeof FILE | typeof FOLDER,
  });
  if (!deleted) {
    return new Response('Failed to delete document', { status: 500 });
  }

  return NextResponse.json(deleted);
}
