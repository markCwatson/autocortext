export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Job = {
  id: Id;
  columnId: Id;
  title: string;
  description: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
};
