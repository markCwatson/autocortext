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
  pages: {
    signIn: '/',
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

        let ret = null;
        if (user && bcrypt.compareSync(password, user.password)) {
          ret = {
            id: user._id!.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId?.toString() || undefined,
            image: undefined, // todo: store images (add to UserModel too)
          };
        }

        return ret;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve('/dashboard');
    },
    async jwt({ token, user }) {
      if (user) {
        // Ensure the user's id and role are in the JWT
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the id/role to the session's user object
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      return session;
    },
  },
};
