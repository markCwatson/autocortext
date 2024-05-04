import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { StuffQAChainParams, loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { PromptTemplate } from '@langchain/core/prompts';
import {
  RecordMetadata,
  type Pinecone,
  Index,
} from '@pinecone-database/pinecone';
import { ListResponse } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { AiMessage } from '@/types';

interface RunRagParams {
  client: Pinecone;
  indexName: string;
  chat: AiMessage[];
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

// For RAG (Retrieval Augmented Generation)
export const runRag = async ({ client, indexName, chat }: RunRagParams) => {
  try {
    // Get the index from vector database
    const index = client.Index(indexName);

    // Extract history and question from chat
    const history = chat.slice(0, chat.length - 1);
    const question = chat.at(-1);

    let machine = '';
    let system = '';
    let instructions = '';

    // Find instructions, machine, and system in the history
    history.forEach((sentence) => {
      if (sentence.role === 'system') {
        instructions = sentence.content;
      }

      const machineMatch = sentence.content.match(/selected the (.+)/);
      if (machineMatch) {
        machine = machineMatch[1];
      }

      const systemMatch = sentence.content.match(
        /is having issues with the (.+)/,
      );
      if (systemMatch) {
        system = systemMatch[1];
      }
    });

    if (!instructions || !machine || !system) {
      throw new Error(
        'System instructions, machine, or system not found in chat history.',
      );
    }

    // Create query embedding
    const embeddingsClient = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-large',
    });
    const queryEmbedding = await embeddingsClient.embedQuery(
      `${machine} ${system} ${question!.content}`,
    );

    // Query Pinecone index and return top k matches
    let queryResponse = await index.query({
      topK: 20,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    });

    if (!queryResponse.matches.length) {
      throw new Error('No matching embeddings found in vector database.');
    }

    // Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({
      modelName: 'gpt-4-turbo',
      temperature: 0.1,
    });

    let inputPrompt: StuffQAChainParams = {
      prompt: new PromptTemplate({
        inputVariables: ['instructions', 'chat_history', 'question', 'context'],
        template:
          'Instructions: {instructions}\nChat History: {chat_history}\nQuestion: {question}\nContext: {context}',
      }),
    };

    const chain = loadQAStuffChain(llm, inputPrompt);
    if (!chain) {
      throw new Error('Failed to load chain.');
    }

    // Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match?.metadata?.pageContent)
      .join(' ');

    // Execute the chain with input documents and question
    const result = await chain.invoke({
      instructions: instructions,
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      chat_history: history.map((h) => h.content),
      question: question!.content,
    });
    if (!result) {
      throw new Error('Invocation of chain failed.');
    }

    return result.text;
  } catch (error) {
    throw error;
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

export const deletePineconeVectors = async ({
  client,
  indexName,
  prefix,
}: {
  client: Pinecone;
  indexName: string;
  prefix: string;
}) => {
  const index = client.index(indexName).namespace('');
  let results = await index.listPaginated({ prefix });

  if (!results.vectors || !results.vectors.length) {
    console.log(`No vectors found with prefix ${prefix} in index ${indexName}`);
    return;
  }

  await deleteVectors(index, results, prefix, indexName);
};

// recursive function to delete vectors
const deleteVectors = async (
  index: Index<RecordMetadata>,
  results: ListResponse,
  prefix: string,
  indexName: string,
) => {
  if (!results || !results.vectors || !results.vectors.length) {
    return;
  }

  const ids = results.vectors!.map((vector) => vector.id);
  await index.deleteMany(ids);
  console.log(
    `Deleted ${ids.length} vectors with prefix ${prefix} in index ${indexName}`,
  );

  if (results.pagination?.next) {
    results = await index.listPaginated({
      prefix,
      paginationToken: results.pagination.next,
    });

    deleteVectors(index, results, prefix, indexName);
  }
};
