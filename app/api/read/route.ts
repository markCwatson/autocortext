import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { runRag } from '@/lib/pinecone';
import CompanyService from '@/services/CompanyService';

// Vercel's max duration is up to 5 mins.
// We are getting 15 second timeouts so increasing to 60 seconds.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { messages, verbosity, audience } = await req.json();
  if (!messages || !verbosity || !audience) {
    return NextResponse.json(
      { error: 'messages, verbosity, and audience are required.' },
      { status: 400, statusText: 'Bad request.' },
    );
  }

  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json(
      { error: 'companyId is required.' },
      { status: 400, statusText: 'Bad request.' },
    );
  }

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  const indexName = await CompanyService.getIndexByCompanyId(companyId);
  if (!indexName) {
    return NextResponse.json(
      { error: 'No index found for the given company.' },
      { status: 404, statusText: 'Index not found.' },
    );
  }

  let res;
  try {
    res = await runRag({
      client: client,
      indexName: indexName,
      chat: messages,
      verbosity: verbosity,
      audience: audience,
    });
    if (!res) {
      return NextResponse.json(
        { error: 'No response from RAG system.' },
        { status: 404, statusText: 'Response not found.' },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'RAG failed.' },
      { status: 500, statusText: `${error}` },
    );
  }

  return NextResponse.json({
    data: res,
  });
}
