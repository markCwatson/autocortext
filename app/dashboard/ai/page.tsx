'use client';

import React, { useEffect, useState } from 'react';
import AnimatedText from '@/components/AnimatedText';

// todo: replace with real AI response
import AiPrompt from '@/components/AiPrompt';

const Ai = () => {
  const [answer, setAnswer] = useState('');

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
          text={answer || 'Nothing to show yet...'}
          show={true}
          animated={true}
          animationDelay={250}
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
};

export default Ai;
