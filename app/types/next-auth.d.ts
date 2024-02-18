/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongodb';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    companyId: string;
    companyName: string;
  }
}

declare module 'next-auth' {
  interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    companyId: string | ObjectId;
    companyName: string;
    image?: string | null;
    password?: string;
  }

  interface Session {
    user: User;
  }
}
