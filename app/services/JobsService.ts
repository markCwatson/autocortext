import JobsRepository, { JobsModel } from '@/repos/JobsRepository';
import { Job } from '@/types';
import { ObjectId } from 'mongodb';

class JobsService {
  static async create(model: JobsModel): Promise<JobsModel | null> {
    return JobsRepository.create(model);
  }

  static async getJobsByCompanyId(
    companyId: string,
  ): Promise<JobsModel[] | null> {
    return JobsRepository.getJobsByCompanyId(new ObjectId(companyId));
  }

  static async delete(id: number, companyId: string): Promise<Job> {
    return JobsRepository.delete(id, new ObjectId(companyId));
  }

  static async update(job: JobsModel): Promise<JobsModel> {
    return JobsRepository.update(job);
  }

  static async countJobsByCompanyId(companyId: string): Promise<number | null> {
    return JobsRepository.countJobsByCompanyId(new ObjectId(companyId));
  }
}

export default JobsService;
