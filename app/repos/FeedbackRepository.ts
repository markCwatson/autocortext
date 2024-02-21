import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';
import { MongoServerError, ObjectId } from 'mongodb';
import { Feedback } from '@/types';

export interface FeedbackModel extends Feedback {
  _id?: ObjectId;
}

class FeedbackRepository {
  static async create(companyId: ObjectId, body: Feedback): Promise<boolean> {
    const { name, email, message, company } = body;

    try {
      const client = await Database.getClient();
      const { insertedId } = await client
        .db()
        .collection('feedback')
        .insertOne({ companyId, name, email, message, company, isRead: false });
      return !!insertedId;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async select(companyId: string): Promise<FeedbackModel> {
    const client = await Database.getClient();

    try {
      const document = await client
        .db()
        .collection('feedback')
        .findOne({ companyId: new ObjectId(companyId) });

      if (!document) {
        throw new ApiError({
          code: 404,
          message: 'Feedback not found',
          explanation: null,
        });
      }

      const feedback: FeedbackModel = {
        _id: document._id,
        name: document.name,
        email: document.email,
        message: document.message,
        company: document.company,
      };

      return feedback;
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getAll(): Promise<FeedbackModel[]> {
    const client = await Database.getClient();

    try {
      const documents = await client
        .db()
        .collection('feedback')
        .find({
          isRead: { $ne: true },
        })
        .toArray();

      const feedbacks: FeedbackModel[] = documents.map((doc) => ({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        message: doc.message,
        company: doc.company,
      }));

      return feedbacks;
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async markAsRead(id: string): Promise<boolean> {
    const client = await Database.getClient();

    try {
      const result = await client
        .db()
        .collection('feedback')
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              isRead: true,
            },
          },
        );

      if (result.modifiedCount === 0) {
        throw new ApiError({
          code: 404,
          message: 'Feedback not found',
          explanation: null,
        });
      }

      return true;
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default FeedbackRepository;
