import JobsRepository, { JobsModel } from '@/repos/JobsRepository';
import { Job } from '@/types';
import { ObjectId } from 'mongodb';
import CompanyService from './CompanyService';

class JobsService {
  static async create(model: JobsModel): Promise<JobsModel | null> {
    const company = await CompanyService.incrementJobCountByCompanyId(model.companyId);
    if (!company) {
      return null;
    }
    return JobsRepository.create(model, company.jobCount);
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
