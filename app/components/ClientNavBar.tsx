'use client';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Session } from 'next-auth/core/types';
import SignOutButton from '@/components/SignOutButton';
import SignInButton from '@/components/SignInButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoSvg from '@/components//LogoSvg';

interface ClientNavbarProps {
  session: Session | null;
}

const ClientNavbar: React.FC<ClientNavbarProps> = ({ session }) => {
  const [userSession, setUserSession] = useState(session);
  const router = useRouter();

  const handleSignOut = () => {
    setUserSession(null);
    router.push('/');
  };

  return (
    <Disclosure as="nav" className="bg-my-color8">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 my-1 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-my-color5 hover:bg-my-color8 hover:text-my-color1 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/** Logo */}
                <div className="flex flex-shrink-0 items-center">
                  <LogoSvg />
                </div>
              </div>
              <div className="flex items-center">
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  <div className="hidden md:flex gap-4">
                    {userSession ? (
                      <SignOutButton onDone={handleSignOut} />
                    ) : (
                      <SignInButton text="Sign In" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/** Disclosure panel on mobile */}
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              <div className="flex justify-between">
                <div className="flex space-x-4 items-center">
                  {userSession ? (
                    <SignOutButton onDone={handleSignOut} />
                  ) : (
                    <SignInButton text="Sign In" />
                  )}
                </div>
                <div className="flex items-center"></div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ClientNavbar;
