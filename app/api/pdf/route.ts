import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: `${fileName}`,
		Body: file,
		ContentType: "file/pdf",
	}

	const command = new PutObjectCommand(params);
	await s3Client.send(command);
	return fileName;
}

export async function POST(request: NextRequest, response: NextResponse) {
	try {
		const formData = await request.formData();
		const fileEntry = formData.get("file");

		// Type guard to assert fileEntry is a File
		if (!(fileEntry instanceof File)) {
			return NextResponse.json( { error: "File is required and must be a valid file." }, { status: 400 } );
		}

		const buffer = Buffer.from(await fileEntry.arrayBuffer());
		const fileName = await uploadFileToS3(buffer, fileEntry.name);

		return NextResponse.json({ success: true, fileName });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
