import JobsRepository, { JobsModel } from '@/repos/JobsRepository';
import { Activity, Job } from '@/types';
import { ObjectId } from 'mongodb';
import CompanyService from '@/services/CompanyService';
import ActivitiesService from './ActivitiesService';

export interface personInfoModel {
  name: string;
  img: string;
}

class JobsService {
  static async create(
    model: JobsModel,
    personInfo: personInfoModel,
  ): Promise<JobsModel | null> {
    const company = await CompanyService.incrementJobCountByCompanyId(
      model.companyId,
    );
    if (!company) {
      return null;
    }

    const createdJob = await JobsRepository.create(model, company.jobCount);
    if (!createdJob) {
      return null;
    }

    const createdActivity: Activity = {
      id: 1,
      type: 'created',
      person: {
        name: personInfo.name!,
        img: personInfo.img || '',
      },
      dateTime: new Date().toISOString(),
      jobId: createdJob._id,
    };

    await ActivitiesService.create(createdActivity);

    return createdJob;
  }

  static async getJobsByCompanyId(
    companyId: string,
  ): Promise<JobsModel[] | null> {
    return JobsRepository.getJobsByCompanyId(new ObjectId(companyId));
  }

  static async delete(id: number, companyId: string): Promise<Job> {
    return JobsRepository.delete(id, new ObjectId(companyId));
  }

  static async deleteByCompanyId(companyId: string): Promise<void> {
    return JobsRepository.deleteByCompanyId(new ObjectId(companyId));
  }

  static async update(job: JobsModel): Promise<JobsModel> {
    return JobsRepository.update(job);
  }

  static async countJobsByCompanyId(companyId: string): Promise<number | null> {
    return JobsRepository.countJobsByCompanyId(new ObjectId(companyId));
  }
}

export default JobsService;
