import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import { Notification } from '@/types';
import ApiError from '@/errors/ApiError';

export interface NotificationModel extends Notification {
  _id?: ObjectId;
}

class NotificationRepository {
  static async create(model: Notification): Promise<NotificationModel> {
    const client = await Database.getClient();
    try {
      const { insertedId } = await client
        .db()
        .collection('notifications')
        .insertOne(model);
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

  static async list(
    companyId: ObjectId,
    userId: ObjectId,
  ): Promise<NotificationModel[]> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('notifications')
        .find({ companyId, isReadBy: { $ne: userId } })
        .toArray() as Promise<NotificationModel[]>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async markAsRead(userId: ObjectId, ids: ObjectId[]): Promise<boolean> {
    const client = await Database.getClient();
    try {
      const result = await client
        .db()
        .collection<NotificationModel>('notifications')
        .updateMany({ _id: { $in: ids } }, { $push: { isReadBy: userId } });
      return result.modifiedCount === ids.length;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async deleteByCompanyId(companyId: ObjectId): Promise<boolean> {
    const client = await Database.getClient();
    try {
      const result = await client
        .db()
        .collection('notifications')
        .deleteMany({ companyId });
      return result.deletedCount === 1;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async deleteByUserId(userId: ObjectId): Promise<boolean> {
    const client = await Database.getClient();
    try {
      const result = await client
        .db()
        .collection('notifications')
        .deleteMany({ recipientId: userId });
      return result.deletedCount === 1;
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
