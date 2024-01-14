import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import Database from '@/lib/db';
import { UserModel } from '@/repos/UsersRepository';

export const authOptions: NextAuthOptions = {
  /** @ts-ignore */
  adapter: MongoDBAdapter(Database.getClient()),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      async authorize(credentials) {
        console.log('authorizing');

        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const client = await Database.getClient();
        const user = (await client
          .db()
          .collection('users')
          .findOne({ email })) as UserModel;

        console.log(user);

        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve('/dashboard');
    },
  },
};
