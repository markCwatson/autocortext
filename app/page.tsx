import type { Metadata } from 'next';
import Login from '@/components/Login';

export const metadata: Metadata = {
  title: 'Auto Cortext',
  description: 'Auto Cortext demo application',
};

export default function Home() {
  return <Login />;
}
