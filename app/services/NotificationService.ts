import NotificationRepository, {
  NotificationModel,
} from '@/repos/NotificationRepository';
import { Notification } from '@/types';
import { ObjectId } from 'mongodb';

class NotificationService {
  static async create(companyId: string, data: Notification): Promise<boolean> {
    const notification = await NotificationRepository.create(
      new ObjectId(companyId),
      data,
    );
    return !!notification;
  }

  static async list(companyId: string): Promise<NotificationModel[]> {
    return NotificationRepository.list(new ObjectId(companyId));
  }

  static async markAsRead(id: string): Promise<boolean> {
    return NotificationRepository.markAsRead(new ObjectId(id));
  }
}

export default NotificationService;
