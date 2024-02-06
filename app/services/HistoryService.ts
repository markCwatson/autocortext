import HistoryRepository from '@/repos/HistoryRepository';

class HistoryService {
  static async create(machine: string, messages: string[], companyId: string) {
    await HistoryRepository.create(machine, messages, companyId);
  }

  static async getHistoryByCompanyId(companyId: string) {
    return await HistoryRepository.getHistoryByCompanyId(companyId);
  }
}

export default HistoryService;
