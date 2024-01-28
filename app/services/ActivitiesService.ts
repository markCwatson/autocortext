import ActivitiesRepository, {
  ActivitiesModel,
} from '@/repos/ActivitiesRepository';
import { ObjectId } from 'mongodb';
import JobsService from './JobsService';

class ActivitiesService {
  static async create(model: ActivitiesModel): Promise<ActivitiesModel | null> {
    const activity = await ActivitiesRepository.create(model);
    if (!activity) return null;
    await JobsService.addActivityToJobById(
      new ObjectId(model.jobId),
      activity?._id,
    );
    return activity;
  }

  static async getActivitiesByIds(
    ids: ObjectId[],
  ): Promise<ActivitiesModel[] | null> {
    return ActivitiesRepository.getActivitiesByIds(ids);
  }
}

export default ActivitiesService;
