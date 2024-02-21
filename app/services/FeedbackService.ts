import FeedbackRepository, { FeedbackModel } from '@/repos/FeedbackRepository';
import { Feedback } from '@/types';
import { ObjectId } from 'mongodb';
import NotificationService from '@/services/NotificationService';

class FeedbackService {
  static async create(companyId: string, body: Feedback): Promise<boolean> {
    const result = await FeedbackRepository.create(
      new ObjectId(companyId),
      body,
    );
    if (!result) {
      return false;
    }

    const { name, email, company } = body;
    await NotificationService.create(
      process.env.NEXT_ASCEND_ENGINEERING_COMPANY_ID!,
      {
        title: `New feedback from ${name} at ${company}`,
        description: `A new feedback has been submitted by ${name} <${email}> from ${company}.`,
        dateTime: `${new Date().toISOString().split('.')[0]}Z`,
      },
    );

    return true;
  }

  static async select(companyId: string): Promise<FeedbackModel> {
    return FeedbackRepository.select(companyId);
  }

  static async getAll(): Promise<FeedbackModel[]> {
    return FeedbackRepository.getAll();
  }

  static async markAsRead(id: string): Promise<boolean> {
    return FeedbackRepository.markAsRead(id);
  }
}

export default FeedbackService;
