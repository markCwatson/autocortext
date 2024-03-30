import NotificationRepository, {
  NotificationModel,
} from '@/repos/NotificationRepository';
import { Notification } from '@/types';
import { ObjectId } from 'mongodb';

class NotificationService {
  static async create(companyId: string, data: Notification): Promise<boolean> {
    const notification = await NotificationRepository.create({
      title: data.title,
      description: data.description,
      recipientId: !data.recipientId ? null : new ObjectId(data.recipientId),
      dateTime: data.dateTime,
      isReadBy: [],
      companyId: new ObjectId(companyId),
    });
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

  static async markAsRead(userId: string, ids: string[]): Promise<boolean> {
    return NotificationRepository.markAsRead(
      new ObjectId(userId),
      ids.map((id) => new ObjectId(id)),
    );
  }

  static async deleteByCompanyId(id: string): Promise<boolean> {
    return NotificationRepository.deleteByCompanyId(new ObjectId(id));
  }

  static async deleteByUserId(id: string): Promise<boolean> {
    return NotificationRepository.deleteByUserId(new ObjectId(id));
  }
}

export default NotificationService;
