'use client';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import JobsActivity from './JobsActivity';
import { Activity, Job } from '@/types';
import {
  Bars2Icon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CubeTransparentIcon,
} from '@heroicons/react/20/solid';
import { toast } from '@/components/Toast';
import { JobsModel } from '@/repos/JobsRepository';

type Props = {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setActivities: (activities: Activity[]) => void;
  onSave: () => void;
  onClose: () => void;
  job: JobsModel;
};

// todo: remove
const severityMap = {
  Severe: <ChevronDoubleUpIcon className="h-5 w-5 text-red-600" />,
  High: <ChevronUpIcon className="h-5 w-5 text-yellow-600" />,
  Medium: <Bars2Icon className="h-5 w-5 text-blue-600" />,
  Low: <ChevronDownIcon className="h-5 w-5 text-green-600" />,
};

export default function JobModal(props: Props) {
  const [open, setOpen] = useState(true);
  const [activities, setActivities] = useState(props.job.activities);

  function handleSave() {
    setOpen(false);
    props.onSave();
    props.onClose();
  }

  async function sendQuery(
    e: React.FormEvent<HTMLFormElement>,
    acts: Activity[],
  ) {
    e.preventDefault();
    if (!acts) return;

    let context = `${props.job.title}\n${props.job.description}.\n`;
    const actsCopy = [...acts];

    context = context.concat(
      actsCopy
        .sort((a, b) => b.id - a.id)
        .map((activity) => {
          if (activity.type === 'commented') {
            return `${activity.person?.name || 'Someone'}: ${activity.comment}`;
          }
        })
        .join('\n'),
    );

    toast({
      title: 'Success',
      message: `Sending query...`,
      duration: 2000,
    });

    try {
      const result = await fetch('/api/read', {
        method: 'POST',
        body: JSON.stringify(context),
      });
      if (!result?.ok) {
        return toast({
          title: 'Error',
          message: `Server status code: ${result.status}`,
          type: 'error',
        });
      }

      const json = await result.json();
      if (json.data) {
        const newActivity: Activity = {
          id: 0,
          jobId: props.job._id.toString(),
          type: 'commented',
          comment: `${json.data}`,
          person: {
            name: 'AI',
          },
          dateTime: `${new Date().toISOString().split('.')[0]}Z`,
        };

        toast({
          title: 'Success',
          message: `Answer received!`,
          duration: 3000,
        });

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

        const newActivities = [...acts, newActivity];
        setActivities(newActivities);
        props.setActivities(newActivities);
      }
    } catch (err) {
      toast({
        title: 'Error',
        message: 'Error sending query. Please try again later.',
        type: 'error',
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-md bg-my-color3 text-my-color5 hover:bg-my-color8">
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setOpen(false);
              props.onClose();
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-my-color8 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-auto max-h-[700px] rounded-lg bg-my-color1 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                    <div className="flex flex-col gap-2 text-my-color10">
                      <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center px-2 py-1 text-md">
                          <p>{'Job Refrence # '}</p>
                          <p className="pl-2">{props.job.id}</p>
                        </div>
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <p className="">{severityMap[props.job.severity]}</p>
                          <p className="">{props.job.severity}</p>
                        </div>
                      </div>
                      <div className="m-0 p-4 border-2 rounded-xl border-my-color3">
                        <Dialog.Title as="h3" className="text-base leading-6">
                          <div className="flex flex-col justify-start gap-2 pb-4 border-b-2 rounded border-my-color3">
                            <p className="w-full pl-2 text-sm">Job Title:</p>
                            <textarea
                              className="w-full max-h-10 p-2 font-semibold resize-none rounded bg-transparent focus:outline-none"
                              value={props.title}
                              onChange={(e) => props.setTitle(e.target.value)}
                              placeholder="Job title here"
                            />
                          </div>
                        </Dialog.Title>
                        <Dialog.Description className="mt-4">
                          <div className="flex flex-col justify-start gap-2 pb-2">
                            <p className="w-full pl-2 text-sm">Description:</p>
                            <textarea
                              className="w-full p-2 rounded bg-transparent focus:outline-none"
                              value={props.description}
                              onChange={(e) =>
                                props.setDescription(e.target.value)
                              }
                              placeholder="Job description here"
                            />
                          </div>
                        </Dialog.Description>
                      </div>
                    </div>
                    <div className="flex mt-5 gap-2 justify-start">
                      <button
                        onClick={() => {
                          setOpen(false);
                          props.onClose();
                        }}
                        className="rounded bg-black py-1 px-4 text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="rounded bg-indigo-600 py-1 px-4 text-white"
                      >
                        Save
                      </button>
                    </div>
                    <div className="mt-6 rounded bg-my-color1 py-2 px-4 text-my-color10">
                      <div className="mb-4 border-b-2 rounded border-my-color3">
                        <Tabs />
                      </div>
                      <JobsActivity
                        jobId={props.job._id.toString()}
                        activities={activities}
                        handler={(event, acts) => {
                          props.setActivities(acts);
                          setActivities(acts);
                          sendQuery(event, acts);
                        }}
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
}

// todo: move all this to a new file
const tabs = [
  { name: 'History', href: '#', current: true },
  { name: 'Comments', href: '#', current: false },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

function Tabs() {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-my-color10 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current)!.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                tab.current
                  ? 'bg-my-color2 text-my-color10'
                  : 'text-my-color10 hover:text-my-color3',
                'px-2 py-1 text-sm font-medium',
              )}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
