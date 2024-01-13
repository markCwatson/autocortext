import { User } from '@prisma/client';

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, 'stripePaymentId'> & {
    stripePayPeriodEnd: number;
    isActive: boolean;
    numOfSubmitsLeft: number;
    obituaryCount: number;
  };

export type Person = {
  name: string;
  age: string;
  bp: string;
  pod: string;
  dob: string;
  dod: string;
  parents: string;
  survived: string;
  predeceased: string;
  grandParents: string;
  grandKids: string;
  funeral: string;
  about: string;
};

export type FormPrompt = {
  id: string;
  heading: string;
  placeholder: string;
  value: string;
};
