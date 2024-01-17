import { MongoClient, ServerApiVersion, Db } from 'mongodb';

interface DatabaseConnection {
  client: MongoClient;
  db: Db;
}

let isConnected = false;

// Create a global instance of MongoClient
const client = new MongoClient(process.env.DATABASE_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectToDatabase = async (): Promise<DatabaseConnection> => {
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

  return { client, db: client.db('admin') };
};

const disconnectFromDatabase = async (): Promise<void> => {
  if (isConnected) {
    try {
      await client.close();
      isConnected = false;
      console.log('Database disconnected');
    } catch (error) {
      console.error('Failed to disconnect from database:', error);
    }
  }
};

export default {
  connection: null as DatabaseConnection | null,
  async getClient(): Promise<MongoClient> {
    if (!isConnected || !this.connection) {
      this.connection = await connectToDatabase();
    }
    return this.connection.client;
  },
  async dropClient(): Promise<void> {
    await disconnectFromDatabase();
  },
};
