import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';
import AnimatedText from './AnimatedText';
import { AiMessage } from '@/components/AiMessagesProvider';
import { CubeTransparentIcon, UserCircleIcon } from '@heroicons/react/20/solid';

interface Props {
  messages: AiMessage[];
}

export function AiMessageList({ messages }: Props) {
  if (!messages) return <></>;

  return (
    <div
      className="flex flex-col gap-2 px-4 py-8 "
      style={{ maxHeight: '100%', overflowY: 'auto' }}
    >
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn('flex items-center gap-2 p-0 m-0', {
              'justify-end pl-2': message.role === 'user',
              'justify-start pr-2': message.role === 'assistant',
            })}
          >
            {message.role === 'assistant' && (
              <CubeTransparentIcon className="w-4 h-4 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0" style={{ maxWidth: '70%' }}>
              <div
                className={cn(
                  'rounded-lg px-3 text-sm py-1 shadow-md ring-1 bg-my-color2 text-my-color10',
                  {
                    'bg-blue-600 text-white': message.role === 'user',
                  },
                )}
              >
                {message.role === 'user' ? (
                  <p>{message.content.replace('User: ', '')}</p>
                ) : (
                  <AnimatedText
                    text={message.content.replace('AI: ', '')}
                    show={true}
                    animated={true}
                    animationDelay={500}
                  />
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
