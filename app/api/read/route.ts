import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { queryPineconeVectorStoreAndQueryLLM } from '@/lib/pinecone';

const indexName = 'auto-cortext';

// Vercel's max duration is up to 5 mins.
// We are getting 15 second timeouts so increasing to 60 seconds.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  const text = await queryPineconeVectorStoreAndQueryLLM({
    client,
    indexName,
    question: body,
  });

  return NextResponse.json({
    data: text,
  });
}
