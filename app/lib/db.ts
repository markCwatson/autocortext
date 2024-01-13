import { MongoClient, ServerApiVersion, Db } from 'mongodb';

interface DatabaseConnection {
  client: MongoClient;
  db: Db;
}

const client = new MongoClient(process.env.DATABASE_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectToDatabase = async (): Promise<DatabaseConnection> => {
  try {
    console.log(`Connecting to database at url '${process.env.DATABASE_URI}'`);
    await client.connect();
    console.log('Successful Database connection');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }

  return { client, db: client.db('admin') };
};

export default {
  connection: null as DatabaseConnection | null,
  async getClient(): Promise<MongoClient> {
    if (this.connection == null) {
      this.connection = await connectToDatabase();
    }
    return this.connection.client;
  },
};
