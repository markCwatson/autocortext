'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  show: boolean;
  animationDelay?: number;
  animationTextDelay?: number;
  animated?: boolean;
}

export default function AnimatedText({
  text,
  show,
  animated,
  animationDelay = 15,
  animationTextDelay = 100,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState(animated ? '' : text);

  useEffect(() => {
    if (show && animated) {
      let i = 0;
      setTimeout(() => {
        const intervalId = setInterval(() => {
          setDisplayText(text.slice(0, i));
          i++;
          if (i > text.length) {
            clearInterval(intervalId);
          }
        }, animationTextDelay);
        return () => clearInterval(intervalId);
      }, animationDelay);
    } else if (show) {
      setDisplayText(text);
    }
  }, [text]);

  const renderedText = displayText.split('\n').map((line: any, index: any) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return <div>{renderedText}</div>;
}
