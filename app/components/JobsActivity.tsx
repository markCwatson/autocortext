'use client';

import { Fragment, useContext, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import { Activity } from '@/types';
import { toast } from '@/components/Toast';
import { useUserContext } from '@/components/UserProvider';

const moods = [
  {
    name: 'Excited',
    value: 'excited',
    icon: FireIcon,
    iconColor: 'text-black',
    bgColor: 'bg-red-500',
  },
  {
    name: 'Loved',
    value: 'loved',
    icon: HeartIcon,
    iconColor: 'text-black',
    bgColor: 'bg-pink-400',
  },
  {
    name: 'Happy',
    value: 'happy',
    icon: FaceSmileIcon,
    iconColor: 'text-black',
    bgColor: 'bg-green-400',
  },
  {
    name: 'Sad',
    value: 'sad',
    icon: FaceFrownIcon,
    iconColor: 'text-black',
    bgColor: 'bg-yellow-400',
  },
  {
    name: 'Thumbsy',
    value: 'thumbsy',
    icon: HandThumbUpIcon,
    iconColor: 'text-black',
    bgColor: 'bg-blue-500',
  },
  {
    name: 'I feel nothing',
    value: null,
    icon: XMarkIcon,
    iconColor: 'text-gray-400',
    bgColor: 'bg-transparent',
  },
];

interface Props {
  activities?: Activity[];
  handler: (
    e: React.FormEvent<HTMLFormElement>,
    activities: Activity[],
  ) => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function JobsActivity({ activities, handler }: Props) {
  const userValue = useUserContext();

  const [selected, setSelected] = useState(moods[5]);
  const [comment, setComment] = useState('');

  function onCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newActivity: Activity = {
      id: 0,
      type: 'commented',
      personId: userValue.user.id,
      person: {
        name: userValue.user.name || 'You',
        img: userValue.user.image || (
          <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
        ),
      },
      comment,
      dateTime: '2024-01-27T17:59:00',
    };

    let newActivities: Activity[] = [];
    if (activities) {
      activities.map((activity) => activity.id++);
      newActivities = [newActivity, ...activities];
    } else {
      newActivities = [newActivity];
    }

    toast({
      title: 'Success',
      message: `Comment added`,
      duration: 2000,
    });

    setComment('');
    handler(e, newActivities);
  }

  return (
    <>
      {/* New comment form */}
      <div className="my-6 flex gap-x-3">
        {typeof userValue.user.image === 'string' ? (
          <img
            src={userValue.user.image}
            alt=""
            className="h-6 w-6 flex-none rounded-full bg-gray-50"
          />
        ) : (
          <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
        )}
        <form
          action="#"
          className="relative flex-auto"
          onSubmit={(event) => onCommentSubmit(event)}
        >
          <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-my-color10 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={2}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-my-color10 placeholder:text-my-color8 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-my-color10"
                >
                  <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              <div className="flex items-center">
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">
                        Your mood
                      </Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-my-color10">
                          <span className="flex items-center justify-center">
                            {selected.value === null ? (
                              <span>
                                <FaceSmileIcon
                                  className="h-5 w-5 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Add your mood</span>
                              </span>
                            ) : (
                              <span>
                                <span
                                  className={classNames(
                                    selected.bgColor,
                                    'flex h-8 w-8 items-center justify-center rounded-full',
                                  )}
                                >
                                  <selected.icon
                                    className="h-5 w-5 flex-shrink-0 text-white"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="sr-only">{selected.name}</span>
                              </span>
                            )}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            {moods.map((mood) => (
                              <Listbox.Option
                                key={mood.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? 'bg-gray-100' : 'bg-white',
                                    'relative cursor-default select-none px-3 py-2',
                                  )
                                }
                                value={mood}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={classNames(
                                      mood.bgColor,
                                      'flex h-8 w-8 items-center justify-center rounded-full',
                                    )}
                                  >
                                    <mood.icon
                                      className={classNames(
                                        mood.iconColor,
                                        'h-5 w-5 flex-shrink-0',
                                      )}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <span className="ml-3 block truncate font-medium">
                                    {mood.name}
                                  </span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      <ul role="list" className="space-y-6">
        {activities &&
          activities.map((activityItem, activityItemIdx) => (
            <li key={activityItem.id} className="relative flex gap-x-4">
              <div
                className={classNames(
                  activityItemIdx === activities.length - 1
                    ? 'h-6'
                    : '-bottom-6',
                  'absolute left-0 top-0 flex w-6 justify-center',
                )}
              >
                <div className="w-px bg-gray-200" />
              </div>
              {activityItem.type === 'commented' ? (
                <>
                  {typeof activityItem.person?.img === 'string' ? (
                    <img
                      src={activityItem.person.img}
                      alt=""
                      className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                  ) : (
                    activityItem.person?.img || (
                      <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
                    )
                  )}
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-my-color3">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-my-color10">
                        <span className="font-medium text-gray-900">
                          {activityItem.person?.name}
                        </span>{' '}
                        commented
                      </div>
                      <time
                        dateTime={activityItem.dateTime}
                        className="flex-none py-0.5 text-xs leading-5 text-my-color10"
                      >
                        {activityItem.dateTime.split('T')[0]}
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-my-color10">
                      {activityItem.comment}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-my-color1">
                    {activityItem.type === 'finished' ? (
                      <CheckCircleIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-my-color3 ring-1 ring-my-color10" />
                    )}
                  </div>
                  <p className="flex-auto py-0.5 text-xs leading-5 text-my-color10">
                    <span className="font-medium text-my-color10">
                      {activityItem.person?.name}
                    </span>{' '}
                    {activityItem.type} the job.
                  </p>
                  <time
                    dateTime={activityItem.dateTime}
                    className="flex-none py-0.5 text-xs leading-5 text-my-color10"
                  >
                    {activityItem.dateTime.split('T')[0]}
                  </time>
                </>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}
