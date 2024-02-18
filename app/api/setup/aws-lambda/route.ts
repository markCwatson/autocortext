import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { createPineconeIndex, updatePinecone } from '@/lib/pinecone';
import NotificationService from '@/services/NotificationService';
import DocService from '@/services/DocService';

// Vercel's max duration is up to 5 mins.
// We are getting 15 second timeouts so increasing to 120 seconds.
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const doc = body.doc;
  if (!doc) {
    return NextResponse.json({
      data: 'no docs found in the request...',
    });
  }

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  const indexName = 'auto-cortext';
  const vectorDimension = 3072;

  try {
    await createPineconeIndex({
      client,
      indexName,
      vectorDimension,
    });
    await updatePinecone({ client, indexName, docs: doc });
  } catch (err) {
    console.log('error: ', err);
    return NextResponse.json({
      data: 'error creating index and loading data into pinecone...',
    });
  }

  // doc.metadata.source is the key on AWS which is the name of the file in our DB
  for (const d of doc) {
    const companyId = await DocService.getCompanyIdByFilename(
      d.metadata.source,
    );

    await NotificationService.create(companyId, {
      title: 'Auto Coretex ready',
      description: `Auto Coretex has been trained on the new file: ${d.metadata.source}`,
    });
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...',
  });
}
