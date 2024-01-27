'use client';

import { Disclosure } from '@headlessui/react';
import { MailIcon } from 'lucide-react';
import {
  BellAlertIcon,
  ChatBubbleLeftIcon,
  Cog8ToothIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

interface OrgNavBarProps {
  companyId: string;
}

export default function OrgNavBar({ companyId }: OrgNavBarProps) {
  const [companyName, setCompanyName] = useState<string>('Loading company...');

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/company?id=${companyId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCompanyName(data.name);
      } catch (error) {
        console.error('Error fetching company:', error);
        setCompanyName('Failed to load company');
      }
    }

    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  return (
    <Disclosure as="nav" className="bg-my-color7 border-b border-gray-200">
      {({ open }) => (
        <div className="mx-auto max-w-8xl px-2 sm:px-10 lg:px-12">
          <div className="flex h-10 justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 md:flex md:items-center text-sm">
                {`Your company: ${companyName}`}
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
