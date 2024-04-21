import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { useQueryContext } from '@/providers/AiMessagesProvider';
import { Loader2 } from 'lucide-react';
import { AiMessage } from '@/types';

interface AiPromptChatProps {
  isVerbose: boolean;
  isLoading: boolean;
  callback: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
    newMessage: AiMessage,
  ) => void;
}

export default function AiPromptChat({
  isVerbose,
  isLoading,
  callback,
}: AiPromptChatProps) {
  const [inputValue, setInputValue] = useState('');
  const { messages, setMessages } = useQueryContext();

  function handleSubmit(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    if (inputValue.trim()) {
      const userInput = isVerbose
        ? inputValue.concat(
            '*!*. Do not use markdown format (plain text only, but a numbered list is ok).',
          )
        : inputValue.concat(
            '*!*. Please be as concise as possible. Keep the response to only a few sentences.',
          );
      const newMessage: AiMessage = {
        id: String(messages.length + 1),
        content: `User: ${userInput}`,
        role: 'user',
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue('');
      callback(e, newMessage);
    }
  }

  return (
    <div className="grid grid-cols-5 pb-8">
      <input
        className="col-span-4 rounded border text-black text-sm mr-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={isLoading ? `Please wait...` : `Enter your query here`}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e);
          }
        }}
      />
      <Button
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        ) : (
          'Submit'
        )}
      </Button>
    </div>
  );
}
