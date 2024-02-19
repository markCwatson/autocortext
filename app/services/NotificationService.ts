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

  static async list(
    companyId: string,
    userId: string,
  ): Promise<NotificationModel[]> {
    return NotificationRepository.list(
      new ObjectId(companyId),
      new ObjectId(userId),
    );
  }

  static async markAsRead(id: string, userId: string): Promise<boolean> {
    return NotificationRepository.markAsRead(
      new ObjectId(id),
      new ObjectId(userId),
    );
  }
}

export default NotificationService;
