import JobsRepository, { JobsModel } from '@/repos/JobsRepository';
import { ObjectId } from 'mongodb';

class JobsService {
  static async create(model: JobsModel) {
    return JobsRepository.create(model);
  }

  static async getJobsByCompanyId(
    companyId: string,
  ): Promise<JobsModel[] | null> {
    return JobsRepository.getJobsByCompanyId(new ObjectId(companyId));
  }

  static async delete(id: number, companyId: string) {
    return JobsRepository.delete(id, new ObjectId(companyId));
  }
}

export default JobsService;
