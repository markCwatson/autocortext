import HistoryRepository, { HistoryModel } from '@/repos/HistoryRepository';
import { ObjectId } from 'mongodb';

class HistoryService {
  static async create(
    machine: string,
    messages: string[],
    companyId: string,
  ): Promise<HistoryModel | null> {
    return HistoryRepository.create(machine, messages, new ObjectId(companyId));
  }

  static async getHistoryByCompanyId(
    companyId: string,
  ): Promise<HistoryModel[] | null> {
    return HistoryRepository.getHistoryByCompanyId(new ObjectId(companyId));
  }

  static async delete(_id: string, companyId: string): Promise<HistoryModel> {
    return HistoryRepository.delete(new ObjectId(_id), new ObjectId(companyId));
  }

  static async deleteByCompanyId(companyId: string): Promise<void> {
    return HistoryRepository.deleteByCompanyId(new ObjectId(companyId));
  }
}

export default HistoryService;
