import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';
import { Person } from '@/types';

export interface ActivitiesModel {
  _id: ObjectId;
  jobId: ObjectId;
  personId: ObjectId;
  person: Person;
  description: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
}

class ActivitiesRepository {
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
}

export default ActivitiesRepository;
