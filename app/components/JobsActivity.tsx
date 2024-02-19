'use client';

import { Fragment, use, useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  CubeTransparentIcon,
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
import { useUserContext } from '@/providers/UserProvider';
import classNames from '@/lib/classNames';

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
  jobId: string;
  jobRefNumber: number;
  activities?: Activity[];
  handler: (
    e: React.FormEvent<HTMLFormElement>,
    activities: Activity[],
    isTaggedAi: boolean,
  ) => void;
}

export default function JobsActivity({
  jobId,
  jobRefNumber,
  activities,
  handler,
}: Props) {
  const userValue = useUserContext();

  const [selected, setSelected] = useState(moods[5]);
  const [comment, setComment] = useState('');

  const [suggestions, setSuggestions] = useState<
    { name: string; id?: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    name: string;
    id?: string;
  } | null>(null);

  // todo: fetch user suggestions from the server based on users in the company

  useEffect(() => {
    fetchUserSuggestions();
  }, []);

  const fetchUserSuggestions = async () => {
    const res = await fetch(
      `/api/company/users?companyId=${userValue.user.companyId}`,
    );
    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error fetching user suggestions',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    const data = await res.json();
    const users = data.map((user: { name: string; id: string }) => ({
      name: `@${user.name}`,
      id: user.id,
    }));
    setSuggestions((prev) => [
      {
        name: '@autocortext',
        id: null,
      },
      ...users,
    ]);
  };

  const sendNotificationToMentionedUser = async () => {
    const res = await fetch(
      `/api/notify?companyId=${userValue.user.companyId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${userValue.user.name} mentioned you`,
          description: `${userValue.user.name} mentioned you on job Ref# ${jobRefNumber}`,
          recipientId: selectedSuggestion?.id,
          dateTime: `${new Date().toISOString().split('.')[0]}Z`,
        }),
      },
    );

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error sending notification to mentioned user',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    toast({
      title: 'Success',
      message: `Notification sent to ${selectedSuggestion?.name}`,
      duration: 2000,
    });
  };

  const updateCommentAndCheckForSuggestions = (e: any) => {
    const value = e.target.value;
    setComment(value);

    const parts = value.split(' ');
    const lastPart = parts[parts.length - 1];

    if (lastPart.startsWith('@')) {
      setShowSuggestions(true);
      const query = lastPart.substring(1); // Remove '@' to get the query part
      const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = ({ name, id }: { name: string; id: string }) => {
    // Add the selected suggestion to the comment
    const parts = comment.split(' ');
    parts.pop(); // Remove the last part that includes '@'
    const newComment = `${parts.join(' ')} ${name} `;
    setComment(newComment);

    // Hide the suggestions
    setShowSuggestions(false);

    // To send notification to the selected user
    setSelectedSuggestion({ name, id });
  };

  async function onCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newActivity: Activity = {
      jobId,
      id: activities?.length ? activities.length + 1 : 1,
      type: 'commented',
      person: {
        name: userValue.user.name,
        img: userValue.user.image || '',
      },
      comment,
      dateTime: `${new Date().toISOString().split('.')[0]}Z`,
    };

    const res = await fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newActivity),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error creating job',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    toast({
      title: 'Success',
      message: `Comment added`,
      duration: 2000,
    });

    if (selectedSuggestion) {
      await sendNotificationToMentionedUser();
    }

    const isTaggedAi = comment.includes('@autocortext');
    setComment('');
    const newActivities = activities
      ? [...activities, newActivity]
      : [newActivity];

    handler(e, newActivities, isTaggedAi);
  }

  function parseAndHighlightTags(text: string | undefined) {
    if (!text) return null;

    // This regex matches an @ symbol followed by a word (first name),
    // optionally followed by spaces and another word (last name), capturing only these two words.
    // It assumes names are separated by a single space and both are required.
    const parts = text.split(
      /(@[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:\s+[a-zA-ZÀ-ÖØ-öø-ÿ]+)?)/g,
    );

    return parts.map((part, index) => {
      // Check if the part is a tagged name
      if (part.startsWith('@')) {
        // Check if the part has both first and last name by splitting on spaces
        const nameParts = part.split(/\s+/);
        if (nameParts.length === 2) {
          // Ensure only first and last names are highlighted
          // Render the tagged name with a highlight style
          return (
            <span key={index} className="text-blue-600">
              {part}
            </span>
          );
        } else {
          // If there are more than two names, only highlight the first and last name
          // and return the rest as normal text. This step is needed to correct the logic
          // as per user requirement but based on the current regex, this else block might not be needed.
          // This placeholder is for further logic adjustment if the regex is modified to match more complex patterns.
          return part;
        }
      } else {
        // Render normal text
        return part;
      }
    });
  }

  const renderSuggestions = () => {
    if (showSuggestions && suggestions.length > 0) {
      return (
        <ul className="absolute z-50 mt-1 max-h-60 w-40 overflow-auto rounded-md bg-white py-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`cursor-pointer px-4 py-2 ${
                index === suggestionIndex ? 'bg-gray-100' : 'bg-white'
              }`}
              onMouseDown={() =>
                selectSuggestion({ name: suggestion.name, id: suggestion.id! })
              }
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

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
          <div className="overflow-visible rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-my-color10 focus-within:ring-2 focus-within:ring-indigo-600">
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
              onChange={updateCommentAndCheckForSuggestions}
            />
            <div className="relative">{renderSuggestions()}</div>
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
          activities.toReversed().map((activityItem, activityItemIdx) => (
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
                  {typeof activityItem.person?.img === 'string' &&
                  activityItem.person?.img !== '' ? (
                    <img
                      src={activityItem.person.img}
                      alt=""
                      className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                  ) : activityItem.person?.name === 'Auto Cortext' ? (
                    <CubeTransparentIcon className="w-4 h-4 flex-shrink-0" />
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
                        {`${
                          activityItem.dateTime.split('T')[0]
                        } at ${activityItem.dateTime
                          .split('T')[1]
                          .slice(0, -1)}`}
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-my-color10">
                      {parseAndHighlightTags(activityItem.comment)}
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
                    {`${activityItem.dateTime.split('T')[0]} at ${
                      activityItem.dateTime.split('T')[1].split('.')[0]
                    }`}
                  </time>
                </>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}
