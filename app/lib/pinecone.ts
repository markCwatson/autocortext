import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from 'langchain/llms/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { type Pinecone } from '@pinecone-database/pinecone';

interface QueryPineconeVectorStoreAndQueryLLMParams {
  client: Pinecone;
  indexName: string;
  question: string;
}

interface CreatePineconeIndexParams {
  client: Pinecone;
  indexName: string;
  vectorDimension: number;
}

interface UpdatePineconeParams {
  client: Pinecone;
  indexName: string;
  docs: any;
}

export const queryPineconeVectorStoreAndQueryLLM = async ({
  client,
  indexName,
  question,
}: QueryPineconeVectorStoreAndQueryLLMParams) => {
  const index = client.Index(indexName);

  // Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings({
    modelName: 'text-embedding-3-large',
  }).embedQuery(question);

  // Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  if (queryResponse.matches.length) {
    // Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({
      modelName: 'gpt-4-0125-preview',
      temperature: 0.6,
    });

    const chain = loadQAStuffChain(llm);

    // Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match?.metadata?.pageContent)
      .join(' ');

    // Execute the chain with input documents and question
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });

    return result.text;
  } else {
    console.log('No matching indexes found');
  }
};

export const createPineconeIndex = async ({
  client,
  indexName,
  vectorDimension,
}: CreatePineconeIndexParams) => {
  const { indexes } = await client.listIndexes();
  const indexExists = indexes?.some((index) => index.name === indexName);
  if (!indexExists) {
    console.log(`Creating index "${indexName}"...`);

    await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-west-2',
        },
      },
    });

    // Wait for index initialization
    console.log(
      'Waiting for index to initialize... Please be patient. This may take a few minutes.',
    );
    await new Promise((resolve) => setTimeout(resolve, 180000));
  } else {
    console.log(`"${indexName}" already exists.`);
  }
};

export const updatePinecone = async ({
  client,
  indexName,
  docs,
}: UpdatePineconeParams) => {
  const index = client.Index(indexName);

  // Process each document in the docs array
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;

    // Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    // Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`,
    );

    // Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings({
      modelName: 'text-embedding-3-large',
    }).embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ' ')),
    );

    console.log('Finished embedding documents');
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`,
    );

    // Create and upsert vectors in batches of 100
    const batchSize = 100;
    let batch: any = [];
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];

      const vector = {
        id: `${txtPath}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      };

      batch = [...batch, vector];

      // When batch is full or it's the last item, upsert the vectors
      if (batch.length === batchSize || idx === chunks.length - 1) {
        await index.upsert(batch);
        batch = [];
      }
    }

    console.log(`Pinecone index updated with ${chunks.length} vectors`);
  }

  console.log(`Pinecone index updated with all ${docs.length} documents`);
};

export const deletePineconeIndex = async (
  client: Pinecone,
  indexName: string,
) => {
  const { indexes } = await client.listIndexes();
  const indexExists = indexes?.some((index) => index.name === indexName);
  if (indexExists) {
    console.log(`Deleting index "${indexName}"...`);
    await client.deleteIndex(indexName);
  } else {
    console.log(`"${indexName}" does not exist.`);
  }
};
