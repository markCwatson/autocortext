import { MongoServerError, ObjectId } from 'mongodb';
import ApiError from '@/errors/ApiError';
import Database from '@/lib/db';
import { Activity, Job } from '@/types';

export interface JobsModel extends Job {
  _id: ObjectId;
  activities?: Activity[];
}

class JobsRepository {
  static async create(model: JobsModel): Promise<JobsModel | null> {
    const client = await Database.getClient();
    const newJob = {
      ...model,
      companyId: new ObjectId(model.companyId),
      creatorId: new ObjectId(model.creatorId),
    };

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
          localField: '_id',
          foreignField: 'jobId',
          as: 'activities',
        },
      },
      { $unwind: { path: '$activities', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          id: { $first: '$id' },
          companyId: { $first: '$companyId' },
          creatorId: { $first: '$creatorId' },
          columnId: { $first: '$columnId' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          machine: { $first: '$machine' },
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
          machine: 1,
          severity: 1,
          activities: {
            _id: 1,
            dateTime: 1,
            type: 1,
            person: 1,
            comment: 1,
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

  static async delete(id: number, companyId: ObjectId): Promise<Job> {
    const client = await Database.getClient();

    try {
      const job = (await client
        .db()
        .collection('jobs')
        .findOne({ id, companyId })) as Job | null;

      if (!job) {
        throw new ApiError({
          code: 404,
          message: 'Job not found',
          explanation: 'The job you are trying to delete does not exist.',
        });
      }

      await client.db().collection('jobs').deleteOne({ id, companyId });

      // Return the deleted job
      return job;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async update(job: JobsModel): Promise<JobsModel> {
    const client = await Database.getClient();
    const { _id, companyId, creatorId, activities, ...jobToUpdate } = job;
    const update = {
      ...jobToUpdate,
      companyId: new ObjectId(companyId),
      creatorId: new ObjectId(creatorId),
    };

    try {
      const updatedJob = (await client
        .db()
        .collection('jobs')
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: { ...update } },
          { returnDocument: 'after' },
        )) as JobsModel | null;

      if (!updatedJob) {
        throw new ApiError({
          code: 404,
          message: 'Job not found',
          explanation: 'The job you are trying to update does not exist.',
        });
      }

      return updatedJob;
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
