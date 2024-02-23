'use client';

import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { AiMessage } from '@/providers/AiMessagesProvider';

interface SummaryProps {
  messages: AiMessage[];
}

export default function Summary({ messages }: SummaryProps) {
  const summaryMessage = messages.find((msg) =>
    msg.content.includes('Auto Cortext: Summary:'),
  );

  const summaryText = summaryMessage
    ? summaryMessage.content.replace('Auto Cortext: Summary:', 'Summary:')
    : 'No summary available';

  return (
    <Popover className="relative">
      <Popover.Button className="text-my-color1">
        <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-50 left-1/2 transform -translate-x-1/4  px-2">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-sm bg-my-color1 text-sm leading-6 shadow-lg ring-1 ring-my-color10/5">
            <div className="p-2">
              <div className="group relative flex gap-x-6 rounded-lg p-2">
                <div>
                  <p className="text-my-color10">{summaryText}</p>
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
