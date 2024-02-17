import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import DocService from '@/services/DocService';
import { FILE, FOLDER } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const type = url.searchParams.get('type');
  if (!companyId || !type) {
    return new Response('Company ID and type required', { status: 400 });
  }

  if (type === FILE) {
    try {
      const formData = await req.formData();
      const fileEntry = formData.get('file');
      if (!fileEntry) {
        return new Response('File is required', { status: 400 });
      }

      const parentId = formData.get('parentId');
      const parentPath = formData.get('parentPath');
      if (!parentId || !parentPath) {
        return NextResponse.json(
          { error: 'Parent ID and parent path are required' },
          { status: 400 },
        );
      }

      // Type guard to assert fileEntry is a File
      if (!(fileEntry instanceof Blob)) {
        return NextResponse.json(
          { error: 'File is required and must be a valid file.' },
          { status: 400 },
        );
      }

      const file = Buffer.from(await fileEntry.arrayBuffer());
      const params = {
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
        Key: `${fileEntry.name}`,
        Body: file,
        ContentType: 'application/pdf',
      };

      const s3Client = new S3Client({
        region: process.env.NEXT_AWS_S3_REGION!,
        credentials: {
          accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
        },
      });

      await s3Client.send(new PutObjectCommand(params));
      const doc = await DocService.create({
        name: fileEntry.name,
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
