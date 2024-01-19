import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { createPineconeIndex, updatePinecone } from '@/lib/pinecone';

export async function POST() {
  // todo: change to upload from client
  const loader = new DirectoryLoader('./public', {
    '.txt': (path) => new TextLoader(path),
    '.pdf': (path) => new PDFLoader(path),
  });

  const docs = await loader.load();

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
  });

  try {
    const indexName = 'my-test-pinecone-index';
    const vectorDimension = 1536;
    await createPineconeIndex({ client, indexName, vectorDimension });
    await updatePinecone({ client, indexName, docs });
  } catch (err) {
    console.log('error: ', err);
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...',
  });
}
