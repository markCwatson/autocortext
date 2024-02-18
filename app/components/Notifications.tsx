'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellAlertIcon } from '@heroicons/react/20/solid';
import classNames from '@/lib/classNames';
import { useUserContext } from '@/providers/UserProvider';

export default function Notifications() {
  const userValue = useUserContext();

  const [notifications, setNotifications] = useState<string[]>([
    'notification 1',
    'notification 2',
    'notification 3',
    'notification 4',
    'notification 5',
    `${userValue.user.name}`,
  ]);

  const handleSelection = () => {};

  return (
    <Menu as="div" className={'relative inline-block text-left'}>
      <div>
        <Menu.Button>
          <BellAlertIcon className="h-6 w-6" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {notifications.map((item) => (
              <Menu.Item key={item}>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                    onClick={handleSelection}
                  >
                    {item}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
