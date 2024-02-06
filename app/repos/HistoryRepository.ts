import ApiError from '@/errors/ApiError';
import Database from '@/lib/db';

class HistoryRepository {
  static async create(
    machine: string,
    messages: string[],
    companyId: string,
  ): Promise<void> {
    const title = `${new Date().toISOString().split('T')[0]} - ${machine}`;
    const client = await Database.getClient();
    try {
      await client
        .db()
        .collection('history')
        .insertOne({ title, messages, companyId });
    } catch (error: any) {
      throw new ApiError({
        code: 500,
        message: error.message,
        explanation: null,
      });
    }
  }

  static async getHistoryByCompanyId(companyId: string) {
    const client = await Database.getClient();

    try {
      return client.db().collection('history').find({ companyId }).toArray();
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
