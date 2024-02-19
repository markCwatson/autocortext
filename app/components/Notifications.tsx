'use client';

import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellAlertIcon } from '@heroicons/react/20/solid';
import { useUserContext } from '@/providers/UserProvider';
import NotificationCard from '@/components/NotificationCard';
import { toast } from '@/components/Toast';
import { NotificationModel } from '@/repos/NotificationRepository';

export default function Notifications() {
  const userValue = useUserContext();

  const [notifications, setNotifications] = useState<NotificationModel[]>([]);

  // todo: consider using AWS AppSync to subscribe to new notifications
  // instead of polling the server every x seconds. This would reduce
  // the load on the server and improve the user experience.
  useEffect(() => {
    // Fetch notifications immediately when the component mounts
    fetchNotifications();

    // Set up a timer to fetch notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch(
      `/api/notify?companyId=${userValue.user.companyId}&userId=${userValue.user.id}`,
    );
    if (!response.ok) {
      toast({
        title: 'Error',
        message: 'Failed to fetch notifications',
        type: 'error',
      });
      return;
    }

    const data = await response.json();
    if (!data) {
      return;
    }

    // if there is a recipientId, only show notifications for the current user
    const displayedNotifications = data.filter(
      (notification: NotificationModel) => {
        return (
          !notification.recipientId ||
          notification.recipientId === userValue.user.id
        );
      },
    );
    setNotifications(displayedNotifications);
  };

  const markNotificationAsRead = async (id: string) => {
    const response = await fetch(
      `/api/notify?id=${id}&userId=${userValue.user.id}`,
      {
        method: 'PUT',
      },
    );
    if (!response.ok) {
      toast({
        title: 'Error',
        message: 'Failed to mark notification as read',
        type: 'error',
      });
      return;
    }

    fetchNotifications();
  };

  return (
    <Menu as="div" className={'relative inline-block text-center'}>
      <div>
        <Menu.Button className={'flex items-center'}>
          <BellAlertIcon className="h-6 w-6 hover:opacity-70 cursor-pointer" />
          {notifications.length > 0 && (
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-red-500 rounded-full h-4 w-4">
              <span className="text-xs text-white">{notifications.length}</span>
            </div>
          )}
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
        <Menu.Items className="max-h-[500px] overflow-scroll absolute -left-0 transform -translate-x-3/4 z-50 mt-2 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            {notifications.length > 0 ? (
              <>
                <div className="text-center text-my-color8 text-sm border-b">
                  <div className="font-semibold pb-2">Notifications</div>
                </div>
                {notifications.map((item, index) => (
                  <Menu.Item key={item._id!.toString()}>
                    {({ active }) => (
                      <NotificationCard
                        title={item.title}
                        description={item.description}
                        dateTime={item.dateTime}
                        onClick={() => {
                          markNotificationAsRead(item._id!.toString());
                        }}
                      />
                    )}
                  </Menu.Item>
                ))}
              </>
            ) : (
              <Menu.Item
                as={'div'}
                className="flex items-center justify-center h-32"
              >
                <div className="text-center text-my-color8 text-sm">
                  No new notifications
                </div>
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
