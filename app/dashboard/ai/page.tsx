import React from 'react';
import AnimatedText from '@/components/AnimatedText';

// todo: replace with real AI response
import { text } from './DemoScript';

const Ai = () => {
  return (
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
        text={text}
        show={true}
        animated={true}
        animationDelay={250}
      />
    </div>
  );
};

export default Ai;
