import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import { Notification } from '@/types';
import ApiError from '@/errors/ApiError';

export interface NotificationModel extends Notification {
  _id?: ObjectId;
}

class NotificationRepository {
  static async create(
    companyId: ObjectId,
    model: {
      title: string;
      description: string;
    },
  ): Promise<NotificationModel> {
    const client = await Database.getClient();
    try {
      const { insertedId } = await client
        .db()
        .collection('notifications')
        .insertOne({ ...model, companyId, isRead: false });
      return client
        .db()
        .collection('notifications')
        .findOne({ _id: insertedId }) as Promise<NotificationModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async list(companyId: ObjectId): Promise<NotificationModel[]> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('notifications')
        .find({ companyId, isRead: false })
        .toArray() as Promise<NotificationModel[]>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async markAsRead(id: ObjectId): Promise<boolean> {
    const client = await Database.getClient();
    try {
      const result = await client
        .db()
        .collection('notifications')
        .updateOne({ _id: id }, { $set: { isRead: true } });
      return result.modifiedCount === 1;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default NotificationRepository;
