import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

// see @/lib/auth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
