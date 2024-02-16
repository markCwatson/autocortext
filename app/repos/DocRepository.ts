import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';
import { Doc } from '@/types';

export interface DocModel extends Doc {
  _id: ObjectId;
  companyId: ObjectId;
}

class DocRepository {
  static async create({ url, companyId, path }: Doc): Promise<DocModel> {
    try {
      const client = await Database.getClient();
      const { insertedId } = await client
        .db()
        .collection('docs')
        .insertOne({ url, companyId, path });
      return client
        .db()
        .collection('docs')
        .findOne({ _id: insertedId }) as Promise<DocModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getAllByCompanyId(companyId: string): Promise<DocModel[]> {
    const client = await Database.getClient();
    return client
      .db()
      .collection('docs')
      .find({ companyId: new ObjectId(companyId) })
      .toArray() as Promise<DocModel[]>;
  }
}

export default DocRepository;
