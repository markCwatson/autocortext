import { MongoServerError, ObjectId } from 'mongodb';
import ApiError from '@/errors/ApiError';
import Database from '@/lib/db';
import { ActivitiesModel } from './ActivitiesRepository';

export interface JobsModel {
  _id: ObjectId;
  companyId: ObjectId;
  creatorId: ObjectId;
  columnId: string;
  title: string;
  description: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
  activityIds?: ObjectId[];
  activities?: ActivitiesModel[];
}

class JobsRepository {
  static async create(model: JobsModel): Promise<JobsModel | null> {
    const client = await Database.getClient();
    const newJob = {
      ...model,
      companyId: new ObjectId(model.companyId),
      creatorId: new ObjectId(model.creatorId),
    };

    // todo: add created activity

    try {
      const { insertedId } = await client
        .db()
        .collection('jobs')
        .insertOne(newJob);
      return client
        .db()
        .collection('jobs')
        .findOne({ _id: insertedId }) as Promise<JobsModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getJobsByCompanyId(
    companyId: ObjectId,
  ): Promise<JobsModel[] | null> {
    const client = await Database.getClient();

    const pipeline = [
      { $match: { companyId } },
      {
        $lookup: {
          from: 'activities',
          localField: 'activityIds',
          foreignField: '_id',
          as: 'activities',
        },
      },
      { $unwind: { path: '$activities', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'activities.personId',
          foreignField: '_id',
          as: 'activities.user',
        },
      },
      {
        $unwind: { path: '$activities.user', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: '$_id',
          id: { $first: '$id' },
          companyId: { $first: '$companyId' },
          creatorId: { $first: '$creatorId' },
          columnId: { $first: '$columnId' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          severity: { $first: '$severity' },
          activities: { $push: '$activities' },
        },
      },
      {
        $project: {
          _id: 1,
          id: 1,
          companyId: 1,
          creatorId: 1,
          columnId: 1,
          title: 1,
          description: 1,
          severity: 1,
          activities: {
            _id: 1,
            dateTime: 1,
            type: 1,
            person: {
              name: '$activities.user.name',
              image: '$activities.user.image',
            },
          },
        },
      },
    ];

    try {
      return client
        .db()
        .collection('jobs')
        .aggregate(pipeline)
        .toArray() as Promise<JobsModel[]>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default JobsRepository;
