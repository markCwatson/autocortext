'use client';

import React, { CSSProperties, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AiHeader from '@/components/AiHeader';
import { toast } from '@/components/Toast';
import { AiMessage, useQueryContext } from '@/components/AiMessagesProvider';
import { AiMessageList } from '@/components/AiMessageList';
import AiPromptChat from '@/components/AiPromptChat';

// todo: a lot of duplicate code here with docs page. refactor into a component

const navBarHeight = '170px';

const mainContainerStyle: CSSProperties = {
  height: `calc(100vh - ${navBarHeight})`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const columnStyle: CSSProperties = {
  height: '100%',
};

export default function Reports() {
  const session = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const { messages, setMessages } = useQueryContext();

  useEffect(() => {
    if (session.data?.user.name && messages.length === 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${prevMessages.length + 1}`,
          content: `AI: Hello ${session.data.user.name}.

        I am ready to assist you in generating reports, troubleshooting equipment failures, planning maitenance work, and more.

        Please ask me a question in the text box below.`,
          role: 'assistant',
        },
      ]);
    }
  }, [session]);

  async function sendQuery(event: any, newMessage: AiMessage) {
    event.preventDefault();
    if (!messages) return;
    const context = [...messages, newMessage]
      .map((message) => message.content)
      .join('\n');

    setIsLoading(true);

    toast({
      title: 'Success',
      message: `Sending query...`,
      duration: 2000,
    });

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      });

      if (!response?.ok) {
        return toast({
          title: 'Error',
          message: `Server status code: ${response.status}`,
          type: 'error',
        });
      }

      const json = await response.json();
      if (json.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `${prevMessages.length + 1}`,
            content: `AI: ${json.data}`,
            role: 'assistant',
          },
        ]);

        toast({
          title: 'Success',
          message: `Answer received!`,
          duration: 3000,
        });
      }
    } catch (err) {
      console.log('err:', err);
      toast({
        title: 'Error',
        message: 'Error sending query. Please try again later.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
      <div
        className="grid pt-2 grid-cols-1 lg:grid-cols-7 gap-x-4 gap-y-10"
        style={columnStyle}
      >
        {/* Left empty div */}
        <div className="bg-transparent lg:visible lg:col-span-2" />
        {/* Chat Window */}
        <div className="lg:col-span-3 pb-8 bg-my-color7 border rounded overflow-scroll">
          <AiHeader
            dropDownList={[
              'auto-cortext-rev-0.0.1', // 'gpt-3.5-turbo-instruct',
              'auto-cortext-rev-0.1.2', // 'gpt-3.5-turbo-1106',
              'auto-cortext-rev-1.0.0', // gpt-4-1106-preview',
            ]}
            messages={messages}
          />
          <div className="flex flex-col justify-center w-full h-full">
            <AiMessageList messages={messages} />
            <div className="w-full px-4">
              <AiPromptChat callback={sendQuery} isLoading={isLoading} />
            </div>
          </div>
        </div>
        {/* Right empty div */}
        <div className="bg-transparent hidden lg:visible lg:col-span-2" />
      </div>
    </main>
  );
}
