import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { AiMessage, useQueryContext } from '@/components/AiMessagesProvider';
import { Loader2 } from 'lucide-react';

interface AiPromptChatProps {
  isLoading: boolean;
  callback: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newMessage: AiMessage,
  ) => void;
}

export default function AiPromptChat({
  isLoading,
  callback,
}: AiPromptChatProps) {
  const [inputValue, setInputValue] = useState('');
  const { messages, setMessages } = useQueryContext();

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: AiMessage = {
        id: String(messages.length + 1),
        content: `User: ${inputValue}`,
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
        placeholder="Enter query here..."
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
