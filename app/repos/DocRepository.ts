import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';
import { Doc } from '@/types';

export interface DocModel extends Doc {
  _id: ObjectId;
  companyId: ObjectId;
  parentId: ObjectId;
}

class DocRepository {
  static async create(doc: Doc): Promise<DocModel> {
    try {
      const client = await Database.getClient();
      const { insertedId } = await client
        .db()
        .collection('docs')
        .insertOne(doc);
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

  static async getDocById(docId: ObjectId): Promise<DocModel | null> {
    const client = await Database.getClient();
    return client
      .db()
      .collection('docs')
      .findOne({ _id: docId }) as Promise<DocModel | null>;
  }

  static async updateParentChildrenIds(
    parentId: ObjectId,
    childId: ObjectId,
  ): Promise<void> {
    const client = await Database.getClient();
    await client
      .db()
      .collection('docs')
      .updateOne(
        { _id: new ObjectId(parentId) },
        { $push: { childrenIds: childId } },
      );
  }

  static async delete(docId: ObjectId): Promise<void> {
    const client = await Database.getClient();
    try {
      await client.db().collection('docs').deleteOne({ _id: docId });
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async updateOne(
    docId: ObjectId,
    update: Partial<Doc>,
  ): Promise<DocModel> {
    const client = await Database.getClient();
    try {
      if (update.$pull) {
        await client
          .db()
          .collection('docs')
          .updateOne({ _id: docId }, { $pull: update.$pull });
      } else {
        await client
          .db()
          .collection('docs')
          .updateOne({ _id: docId }, { $set: update });
      }

      return client
        .db()
        .collection('docs')
        .findOne({ _id: docId }) as Promise<DocModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default DocRepository;
