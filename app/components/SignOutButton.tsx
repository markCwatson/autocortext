'use client';

import { signOut } from 'next-auth/react';
import { FC, useState } from 'react';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';

/**
 * NextJS does not allow to pass function from server -> client components,
 * hence this unreusable component.
 */

interface SignOutButtonProps {
  onDone: () => void;
}

const SignOutButton: FC<SignOutButtonProps> = ({ onDone }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signUserOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      setIsLoading(false);
      onDone();
    } catch (error) {
      toast({
        title: 'Error signing out',
        message: 'Please try again later.',
        type: 'error',
      });
    }
  };

  return (
    <Button onClick={signUserOut} isLoading={isLoading}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
