import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { createPineconeIndex, updatePinecone } from '@/lib/pinecone';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body: ', body);

  const docs = body.doc;
  if (!docs) {
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
    await updatePinecone({ client, indexName, docs });
  } catch (err) {
    console.log('error: ', err);
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...',
  });
}
