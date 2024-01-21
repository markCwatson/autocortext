import type { Metadata } from 'next';
import Login from '@/components/Login';

export const metadata: Metadata = {
  title: 'Auto CortexT',
  description: 'Auto CortexT demo application',
};

export default function Home() {
  return <Login />;
}
