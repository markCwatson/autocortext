import type { Metadata } from 'next';
import Login from './components/Login';

export const metadata: Metadata = {
  title: 'AscendAI',
  description: 'AscendAI demo application',
};

export default function Home() {
  return (
    <>
      <Login />
    </>
  );
}
