import { ObjectId } from 'mongodb';
import ApiError from '@/errors/ApiError';
import Database from '@/lib/db';
import { AiMessage, History } from '@/types';

export interface HistoryModel extends History {
  _id: ObjectId;
  companyId: ObjectId;
}

class HistoryRepository {
  static async create(
    machine: string,
    messages: AiMessage[],
    companyId: ObjectId,
  ): Promise<HistoryModel | null> {
    const title = `${new Date().toISOString().split('T')[0]} - ${machine}`;
    const client = await Database.getClient();

    try {
      const { insertedId } = await client
        .db()
        .collection('history')
        .insertOne({ title, messages, companyId });
      return client
        .db()
        .collection('history')
        .findOne({ _id: insertedId }) as Promise<HistoryModel>;
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async update(
    _id: ObjectId,
    title: string,
  ): Promise<HistoryModel | null> {
    const client = await Database.getClient();
    try {
      const history = (await client
        .db()
        .collection('history')
        .findOne({ _id })) as HistoryModel | null;

      if (!history) {
        throw new ApiError({
          code: 404,
          message: 'History item not found',
          explanation:
            'The history item you are trying to update does not exist.',
        });
      }

      await client
        .db()
        .collection('history')
        .updateOne({ _id }, { $set: { title } });

      return { ...history, title };
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getHistoryByCompanyId(
    companyId: ObjectId,
  ): Promise<HistoryModel[] | null> {
    const client = await Database.getClient();

    try {
      return client
        .db()
        .collection('history')
        .find({ companyId })
        .toArray() as Promise<HistoryModel[]>;
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async delete(
    _id: ObjectId,
    companyId: ObjectId,
  ): Promise<HistoryModel> {
    const client = await Database.getClient();
    try {
      const history = (await client
        .db()
        .collection('history')
        .findOne({ _id, companyId })) as HistoryModel | null;

      if (!history) {
        throw new ApiError({
          code: 404,
          message: 'History item not found',
          explanation:
            'The history item you are trying to delete does not exist.',
        });
      }

      await client.db().collection('history').deleteOne({ _id, companyId });

      return history;
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async deleteByCompanyId(companyId: ObjectId): Promise<void> {
    const client = await Database.getClient();
    try {
      await client.db().collection('history').deleteMany({ companyId });
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default HistoryRepository;
