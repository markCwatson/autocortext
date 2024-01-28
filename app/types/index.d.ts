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
  type:
    | 'created'
    | 'commented'
    | 'edited'
    | 'viewed'
    | 'started'
    | 'finished'
    | 'deleted'
    | 'moved';
  person?: Person;
  comment?: string;
  dateTime: string;
  jobId: string;
};

export type Job = {
  id: Id;
  companyId: string;
  creatorId: string;
  columnId: Id;
  title: string;
  description: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
  activities?: Activity[];
};
