import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { runRag } from '@/lib/pinecone';
import CompanyService from '@/services/CompanyService';
import ApiError from '@/errors/ApiError';

// Vercel's max duration is up to 5 mins.
// We are getting 15 second timeouts so increasing to 60 seconds.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    throw new ApiError({
      code: 400,
      message: 'Bad Request',
      explanation: 'No companyId found in the request.',
    });
  }

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  const indexName = await CompanyService.getIndexByCompanyId(companyId);
  if (!indexName) {
    throw new ApiError({
      code: 500,
      message: 'Error',
      explanation: 'No index found for the given company.',
    });
  }

  const text = await runRag({ client, indexName, question: body });
  if (!text) {
    throw new ApiError({
      code: 500,
      message: 'Error',
      explanation: 'No matching documents found.',
    });
  }

  return NextResponse.json({
    data: text,
  });
}
