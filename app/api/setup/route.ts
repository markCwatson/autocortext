import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { createPineconeIndex, updatePinecone } from '@/lib/pinecone';

export async function POST(req: NextRequest) {
  // for creating embeddings locally
  const loader = new DirectoryLoader('./scripts/convert/text', {
    '.txt': (path) => new TextLoader(path),
  });

  const docs = await loader.load();

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  // this is the index name for ascend ai (as of Feb 2024)
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
    return NextResponse.json({
      data: 'error creating index and loading data into pinecone...',
    });
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...',
  });
}
