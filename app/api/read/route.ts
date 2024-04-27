import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { queryPineconeVectorStoreAndQueryLLM } from '@/lib/pinecone';
import CompanyService from '@/services/CompanyService';

// Vercel's max duration is up to 5 mins.
// We are getting 15 second timeouts so increasing to 60 seconds.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body ->', body);
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json({
      data: 'no companyId found in the request...',
    });
  }

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  const indexName = await CompanyService.getIndexByCompanyId(companyId);
  if (!indexName) {
    return NextResponse.json({
      data: 'no index found for the given company...',
    });
  }

  const text = await queryPineconeVectorStoreAndQueryLLM({
    client,
    indexName,
    question: body,
  });

  return NextResponse.json({
    data: text,
  });
}
