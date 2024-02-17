import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// This route allows client-side file uplaods to S3 by providing a signed URL
export async function POST(req: NextRequest) {
  const s3Client = new S3Client({
    region: process.env.NEXT_AWS_S3_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
    },
  });

  const { fileName, contentType } = await req.json();

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating upload URL' });
  }
}
