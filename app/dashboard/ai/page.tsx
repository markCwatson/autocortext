'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AnimatedText from '@/components/AnimatedText';
import AiPrompt from '@/components/AiPrompt';
import AiHeader from '@/components/AiHeader';

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
      <AiHeader
        dropDownList={[
          'gpt-3.5-turbo-instruct',
          'gpt-3.5-turbo-1106',
          'gpt-4-1106-preview',
        ]}
        report={answer}
      />
      <p className="my-8 border p-8 rounded">
        <AnimatedText
          text={answer}
          show={true}
          animated={true}
          animationDelay={500}
        />
      </p>
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
