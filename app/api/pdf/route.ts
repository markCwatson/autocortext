import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import DocService from '@/services/DocService';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return new Response('Company ID is required', { status: 400 });
  }

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
    const doc = await DocService.create(fileEntry.name, companyId);
    if (!doc) {
      return NextResponse.json(
        { error: 'Error creating document in the database' },
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
}
