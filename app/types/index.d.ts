import { AiMessage } from '@/components/AiMessagesProvider';
import { ObjectId } from 'mongodb';

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Person = {
  name: string;
  img?: string;
};

export type Activity = {
  id: number;
  type: 'created' | 'commented' | 'edited' | 'started' | 'finished' | 'paused';
  person?: Person;
  comment?: string;
  dateTime: string;
  jobId: string | ObjectId;
};

export type Job = {
  id: Id;
  companyId: string;
  creatorId: string;
  columnId: Id;
  title: string;
  description: string;
  machine: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
  activities?: Activity[];
};

export type History = {
  title: string;
  messages: AiMessage[];
  companyId: string;
};
