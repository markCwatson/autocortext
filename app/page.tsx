import type { Metadata } from 'next';
import Login from '@/components/Login';

export const metadata: Metadata = {
  title: 'CORETEXT',
  description: 'CORETEXT demo application',
};

export default function Home() {
  return <Login />;
}
