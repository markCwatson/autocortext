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
}

export default ActivitiesService;
