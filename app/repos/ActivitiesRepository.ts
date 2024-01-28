import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';
import { Activity } from '@/types';

export interface ActivitiesModel extends Activity {
  _id?: ObjectId;
  jobId: ObjectId;
}

class ActivitiesRepository {
  static async create(model: ActivitiesModel): Promise<ActivitiesModel | null> {
    const client = await Database.getClient();

    try {
      const { insertedId } = await client
        .db()
        .collection('activities')
        .insertOne(model);
      return client
        .db()
        .collection('activities')
        .findOne({ _id: insertedId }) as Promise<ActivitiesModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getActivitiesByIds(ids: ObjectId[]): Promise<ActivitiesModel[]> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('activities')
        .find({ _id: { $in: ids } })
        .toArray() as Promise<ActivitiesModel[]>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async delete(jobId: ObjectId): Promise<void> {
    const client = await Database.getClient();
    try {
      await client.db().collection('activities').deleteMany({ jobId });
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default ActivitiesRepository;
