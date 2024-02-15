import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';

export interface CompanyModel {
  _id?: ObjectId;
  name: string;
  slug: string;
  createdAt: string;
  jobCount: number;
}

class CompanyRepository {
  static async create(model: CompanyModel): Promise<CompanyModel | null> {
    const client = await Database.getClient();
    try {
      const { insertedId } = await client
        .db()
        .collection('companies')
        .insertOne(model);
      return client
        .db()
        .collection('companies')
        .findOne({ _id: insertedId }) as Promise<CompanyModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async delete(companyId: ObjectId): Promise<Boolean> {
    const client = await Database.getClient();
    try {
      const result = await client
        .db()
        .collection('companies')
        .deleteOne({ _id: companyId });
      return result.deletedCount === 1;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async selectById(id: ObjectId): Promise<CompanyModel | null> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('companies')
        .findOne({ _id: id }) as Promise<CompanyModel | null>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async selectBySlug(slug: string): Promise<CompanyModel | null> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('companies')
        .findOne({ slug }) as Promise<CompanyModel | null>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getAllCompanies(): Promise<CompanyModel[]> {
    const client = await Database.getClient();
    try {
      return client.db().collection('companies').find({}).toArray() as Promise<
        CompanyModel[]
      >;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async incrementJobCountByCompanyId(companyId: string): Promise<CompanyModel | null> {
    const client = await Database.getClient();
    try {
      await client
        .db()
        .collection('companies')
        .updateOne(
          { _id: new ObjectId(companyId) },
          { $inc: { jobCount: 1 } }
        );
      return client
        .db()
        .collection('companies')
        .findOne({ _id: new ObjectId(companyId) }) as Promise<CompanyModel | null>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }
}

export default CompanyRepository;
