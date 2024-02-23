import ActivitiesRepository, {
  ActivitiesModel,
} from '@/repos/ActivitiesRepository';
import { ObjectId } from 'mongodb';
import { Activity } from '@/types';

class ActivitiesService {
  static async create(model: Activity): Promise<ActivitiesModel | null> {
    return ActivitiesRepository.create({
      ...model,
      jobId: new ObjectId(model.jobId),
    });
  }

  static async getActivitiesByIds(
    ids: ObjectId[],
  ): Promise<ActivitiesModel[] | null> {
    return ActivitiesRepository.getActivitiesByIds(ids);
  }

  static async delete(jobId: string): Promise<void> {
    return ActivitiesRepository.delete(new ObjectId(jobId));
  }

  static async deleteByCompanyId(companyId: string): Promise<void> {
    return ActivitiesRepository.deleteByCompanyId(new ObjectId(companyId));
  }
}

export default ActivitiesService;
