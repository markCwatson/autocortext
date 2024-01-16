'use client';

import { Disclosure } from '@headlessui/react';
import DropdownButton from './DropdownButton';
import { MailIcon } from 'lucide-react';
import {
  BellAlertIcon,
  ChatBubbleLeftIcon,
  Cog8ToothIcon,
} from '@heroicons/react/20/solid';

export default function OrgNavBar() {
  return (
    <Disclosure as="nav" className="bg-my-color7 border-b border-gray-200">
      {({ open }) => (
        <div className="mx-auto max-w-8xl px-2 sm:px-10 lg:px-12">
          <div className="flex h-14 justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 md:flex md:items-center">
                <DropdownButton
                  title="Ace Manufacturing, Hamilton"
                  listItems={[
                    'Ace Manufacturing, Hamilton',
                    'Ace Manufacturing, Regina',
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-2 md:gap-4">
                <MailIcon className="h-6 w-6" />
                <ChatBubbleLeftIcon className="h-6 w-6" />
                <BellAlertIcon className="h-6 w-6" />
                <Cog8ToothIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
}
