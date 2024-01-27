export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Person = {
  name: string;
  img?: string | React.JSX.Element;
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
  person: Person;
  comment?: string;
  date: string;
  dateTime: string;
};

export type Job = {
  id: Id;
  columnId: Id;
  title: string;
  description: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
  activities?: Activity[];
};
