/* eslint-disable no-unused-vars */
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    companyId: string;
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    image?: string;
  }

  interface Session {
    user: User;
  }
}
