import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient;
let isConnected = false;

const connectToDatabase = async (): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(process.env.DATABASE_URI!, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log('Successful Database connection');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      isConnected = false;
    }
  }

  return client;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async getClient(): Promise<MongoClient> {
    return connectToDatabase();
  },
};
