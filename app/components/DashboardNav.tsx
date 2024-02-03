'use client';

import * as React from 'react';
import { User } from 'next-auth';
import { useEffect, Fragment, useState } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  DocumentDuplicateIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  BugAntIcon,
  CubeTransparentIcon,
  NewspaperIcon,
  PresentationChartBarIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';
import { toast } from './Toast';
import { useSession } from 'next-auth/react';
import LogoSvg from './LogoSvg';

export const dashboardVariants = cva(
  'w-full text-stone-700 dark:text-stone-300',
  {
    variants: {
      size: {
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Docs',
    href: '/dashboard/docs',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Troubleshoot',
    href: '/dashboard/troubleshoot',
    icon: BugAntIcon,
  },
  {
    name: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Admin',
    href: '/dashboard/admin',
    icon: UserGroupIcon,
  },
  {
    name: 'Data',
    href: '/dashboard/data',
    icon: PresentationChartBarIcon,
  },
  {
    name: 'Equipment',
    href: '/dashboard/equipment',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: QuestionMarkCircleIcon,
  },
  {
    name: 'Privacy',
    href: '/dashboard/privacy',
    icon: NewspaperIcon,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  user: Pick<User, 'name' | 'image' | 'email'>;
};

interface DashboardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardVariants>,
    Props {}

const Dashboard = React.forwardRef<HTMLDivElement, DashboardProps>(
  ({ className, size, children, user, ...props }, ref) => {
    const path = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const session = useSession();
    const [image, setImage] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string>('');

    const getUserImage = async () => {
      // todo: remove this and fetch real image
      // removing to avoid errors about fetching image
      return null;
      if (session.status === 'authenticated' || session.status === 'loading') {
        const res = await fetch(`/api/user`, {
          method: 'GET',
        });

        if (!res.ok) {
          toast({
            title: 'Error',
            message: 'Error fetching user image.',
            type: 'error',
          });
          return;
        }
        return res.json();
      }
    };

    useEffect(() => {
      setImage(true);
    }, [imageSrc]);

    useEffect(() => {
      (async () => {
        const resImage = await getUserImage();
        setImageSrc(resImage?.img);
      })();
    }, []);

    return (
      <>
        <div
          ref={ref}
          {...props}
          className={cn(dashboardVariants({ size, className }))}
        >
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Mobile Sidebar component */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-400 dark:bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                      <div className="flex h-16 p-4 shrink-0 items-center">
                        <LogoSvg />
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      path === item.href
                                        ? 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-200'
                                        : 'text-gray-900 dark:text-gray-200 hover:text-white hover:bg-gray-800',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                    )}
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Mobile menu */}
          <div className="flex items-center justify-between sticky top-0 z-40 md:px-6 md:hidden gap-x-6 bg-gray-900 py-4 px-4 shadow-sm">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-row ">
            {/* Static sidebar for desktop */}
            <div className="hidden md:z-1 md:flex md:w-56 md:flex-col md:flex-grow">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-my-color8 px-6">
                <div className="flex mt-4">
                  <a
                    href="#"
                    className="flex items-center group -mx-2 space-y-1 gap-x-3 rounded-md p-2 text-sm leading-6 font-bold text-my-color10 dark:text-my-color2 hover:text-my-color1 hover:bg-my-color4 dark:hover:bg-my-color8"
                  >
                    <span className="sr-only">Your profile</span>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="Image of user"
                        style={{ borderRadius: '50%', width: '40px' }}
                      />
                    ) : (
                      <UserCircleIcon className="w-6 h-6" />
                    )}
                    <span aria-hidden="true">{user.name}</span>
                  </a>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                path === item.href
                                  ? 'bg-my-color2 text-my-color10 dark:bg-my-color9 dark:text-my-color2'
                                  : 'text-my-color10 dark:text-my-color2 hover:text-my-color1 hover:bg-my-color4 dark:hover:bg-my-color8',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

Dashboard.displayName = 'Dashboard';

export default Dashboard;
