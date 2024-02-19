'use client';

import { Disclosure } from '@headlessui/react';
import { MailIcon } from 'lucide-react';
import { ChatBubbleLeftIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import Notifications from '@/components/Notifications';
import { useUserContext } from '@/providers/UserProvider';

export default function OrgNavBar() {
  const userValue = useUserContext();

  return (
    <Disclosure as="nav" className="bg-my-color7 border-b border-gray-200">
      {({ open }) => (
        <div className="mx-auto max-w-8xl px-2 sm:px-10 lg:px-12">
          <div className="flex h-10 justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 md:flex md:items-center text-sm">
                {`Your company: ${userValue.user.companyName}`}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-2 md:gap-4">
                <MailIcon className="h-6 w-6 hover:opacity-70 hover:cursor-not-allowed" />
                <ChatBubbleLeftIcon className="h-6 w-6 hover:opacity-70 hover:cursor-not-allowed" />
                <Notifications />
                <Cog8ToothIcon className="h-6 w-6 hover:opacity-70 hover:cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
}
