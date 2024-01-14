'use client';

import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

/**
 * NextJS does not allow to pass function from server -> client components,
 * hence this unreusable component.
 */

interface SignInButtonProps {
  text: string;
}

const SignInButton: FC<SignInButtonProps> = ({ text }) => {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signIn = async () => {
    if (session.status === 'authenticated') {
      router.push('/dashboard');
      return;
    }

    setIsLoading(true);
    router.push('/');
  };

  return (
    <Button onClick={signIn} isLoading={isLoading}>
      {text}
    </Button>
  );
};

export default SignInButton;
