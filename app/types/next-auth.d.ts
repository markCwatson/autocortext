/* eslint-disable no-unused-vars */
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    role: string;
  }
}

declare module 'next-auth' {
  interface User {
    name: string;
    email: string;
    role: string;
    image?: string;
  }

  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
