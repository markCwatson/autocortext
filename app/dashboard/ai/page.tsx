'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AnimatedText from '@/components/AnimatedText';
import AiPrompt from '@/components/AiPrompt';

export default function Ai() {
  const [answer, setAnswer] = useState('');
  const session = useSession();

  useEffect(() => {
    if (session.data?.user.name) {
      setAnswer(
        `Hello ${session.data.user.name}. I am ready to assist you. Let me know if you need anything.`,
      );
    }
  }, [session]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const answer = sessionStorage.getItem('answer');
      if (answer) {
        setAnswer(answer);
      }
    };

    window.addEventListener('storageUpdate', handleStorageUpdate);

    return () => {
      window.removeEventListener('storageUpdate', handleStorageUpdate);
    };
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          textAlign: 'left',
          border: '1px solid white',
          margin: 4,
          padding: 50,
        }}
      >
        <AnimatedText
          text={answer}
          show={true}
          animated={true}
          animationDelay={500}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          margin: 8,
        }}
      >
        <AiPrompt />
      </div>
    </>
  );
}
