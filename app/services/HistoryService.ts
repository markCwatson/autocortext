import HistoryRepository, { HistoryModel } from '@/repos/HistoryRepository';
import { ObjectId } from 'mongodb';
import OpenAiService from './OpenAiService';
import { AiMessage } from '@/types';

class HistoryService {
  static async create(
    machine: string,
    messages: AiMessage[],
    companyId: string,
    summarize: boolean,
  ): Promise<HistoryModel | null> {
    let messagesCopy = messages;
    if (summarize) {
      const summary = await OpenAiService.summarize(JSON.stringify(messages));
      messagesCopy = [
        ...messagesCopy,
        {
          id: `${messagesCopy.length + 1}`,
          content: `Auto Cortext: Summary: ${summary}`,
          role: 'assistant',
        },
      ];
    }

    return HistoryRepository.create(
      machine,
      messagesCopy,
      new ObjectId(companyId),
    );
  }

  static async getHistoryByCompanyId(
    companyId: string,
  ): Promise<HistoryModel[] | null> {
    return HistoryRepository.getHistoryByCompanyId(new ObjectId(companyId));
  }

  static async update(
    _id: string,
    title: string,
  ): Promise<HistoryModel | null> {
    return HistoryRepository.update(new ObjectId(_id), title);
  }

  static async delete(_id: string, companyId: string): Promise<HistoryModel> {
    return HistoryRepository.delete(new ObjectId(_id), new ObjectId(companyId));
  }

  static async deleteByCompanyId(companyId: string): Promise<void> {
    return HistoryRepository.deleteByCompanyId(new ObjectId(companyId));
  }
}

export default HistoryService;
