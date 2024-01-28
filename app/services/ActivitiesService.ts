import ActivitiesRepository, {
  ActivitiesModel,
} from '@/repos/ActivitiesRepository';
import { ObjectId } from 'mongodb';

class ActivitiesService {
  static getActivitiesByIds(
    ids: ObjectId[],
  ): Promise<ActivitiesModel[] | null> {
    return ActivitiesRepository.getActivitiesByIds(ids);
  }
}

export default ActivitiesService;
