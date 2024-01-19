'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AnimatedText from '@/components/AnimatedText';
import AiHeader from '@/components/AiHeader';
import AiPromptSimple from '@/components/AirPromptSimple';
import { toast } from '@/components/Toast';
import { useQueryContext } from '@/components/AiQueryProvider';

export default function Reports() {
  const session = useSession();

  const { interaction, setInteraction } = useQueryContext();

  useEffect(() => {
    if (session.data?.user.name) {
      setInteraction({
        ...interaction,
        answer: `Hello ${session.data.user.name}.

        I am ready to assist you in generating reports, troubleshooting equipment failures, planning maitenance work, and more.

        Please ask me a question in the text box below.`,
      });
    }
  }, [session]);

  async function onSubmit(event: any) {
    event.preventDefault();
    if (!interaction.question) return;

    try {
      setInteraction({ ...interaction, loading: true });

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: interaction.question }),
      });

      if (!response?.ok) {
        return toast({
          title: 'Error generating obituary',
          message: `Server status code: ${response.status}`,
          type: 'error',
        });
      }

      const data = await response.json();
      setInteraction({ ...interaction, answer: data.answer, loading: false });
    } catch (err) {
      console.log('err:', err);
      setInteraction({ ...interaction, loading: false });
    }
  }

  return (
    <>
      <AiHeader
        dropDownList={[
          'gpt-3.5-turbo-instruct',
          'gpt-3.5-turbo-1106',
          'gpt-4-1106-preview',
        ]}
        report={interaction.answer}
      />
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <p
            className="my-8 p-8 border rounded bg-my-color1 text-my-color9"
            style={{ width: '80%' }}
          >
            {interaction.answer && (
              <AnimatedText
                text={interaction.answer}
                show={true}
                animated={true}
                animationDelay={500}
              />
            )}
          </p>
          <AiPromptSimple callback={onSubmit} />
        </div>
      </div>
    </>
  );
}
