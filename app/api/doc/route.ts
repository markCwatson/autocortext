import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import DocService from '@/services/DocService';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const type = url.searchParams.get('type');
  if (!companyId || !type) {
    return new Response('Company ID and type required', { status: 400 });
  }

  if (type === 'file') {
    try {
      const formData = await req.formData();
      const fileEntry = formData.get('file');

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
      const doc = await DocService.createFile(fileEntry.name, companyId);
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
  } else if (type === 'folder') {
    const { name, parentId, parentPath, path } = await req.json();
    if (!name || !parentId || !parentPath || !path) {
      return NextResponse.json(
        { error: 'Name, parentId, parentPath, and path are required' },
        { status: 400 },
      );
    }

    const doc = await DocService.createFolder({
      name,
      parentId,
      parentPath,
      companyId,
      path,
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
