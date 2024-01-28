import { MongoServerError, ObjectId } from 'mongodb';
import Database from '@/lib/db';
import ApiError from '@/errors/ApiError';

export interface UserModel {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: ObjectId;
}

class UsersRepository {
  static async create(model: UserModel): Promise<UserModel | null> {
    const client = await Database.getClient();
    try {
      const { insertedId } = await client
        .db()
        .collection('users')
        .insertOne(model);
      return client
        .db()
        .collection('users')
        .findOne({ _id: insertedId }) as Promise<UserModel>;
    } catch (error: MongoServerError | any) {
      UsersRepository.isDuplicateEmailError(error);

      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getUsers(): Promise<UserModel[]> {
    const client = await Database.getClient();
    try {
      return client.db().collection('users').find({}).toArray() as Promise<
        UserModel[]
      >;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async delete(userId: ObjectId): Promise<Boolean> {
    const client = await Database.getClient();
    try {
      const result = await client
        .db()
        .collection('users')
        .deleteOne({ _id: userId });
      return result.deletedCount === 1;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async selectByEmail(email: string): Promise<UserModel | null> {
    const mongo = await Database.getClient();
    try {
      return mongo
        .db()
        .collection('users')
        .findOne({ email }) as Promise<UserModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async selectById(userId: ObjectId): Promise<UserModel | null> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('users')
        .findOne({ _id: userId }) as Promise<UserModel>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async selectByCompanyId(
    companyId: ObjectId,
  ): Promise<UserModel[] | null> {
    const client = await Database.getClient();
    try {
      return client
        .db()
        .collection('users')
        .find({ companyId })
        .toArray() as Promise<UserModel[]>;
    } catch (error: MongoServerError | any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  /** @private */
  static isDuplicateEmailError(error: MongoServerError): void {
    if (error instanceof MongoServerError && error.code === 11000) {
      if (error.keyPattern) {
        if (typeof error.keyPattern['email'] !== 'undefined') {
          throw new ApiError({
            code: 400,
            message: 'Bad request',
            explanation: 'Email already exists',
          });
        }
      }
    }
  }
}

export default UsersRepository;
