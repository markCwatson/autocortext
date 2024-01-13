import type { Metadata } from 'next';
import Login from './components/Login';

export const metadata: Metadata = {
  title: 'quickObit',
  description: 'Generate custom obituaries using ObitsAI',
};

export default function Home() {
  return (
    <>
      <Login />
    </>
  );
}
