'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronDoubleUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Bars2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';

const team = [
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    email: 'whitney.francis@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leonard Krasner',
    email: 'leonard.krasner@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Floyd Miles',
    email: 'floyd.miles@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Emily Selman',
    email: 'emily.selman@example.com',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

interface CreateJobProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setJobDetails: ({
    title,
    description,
    severity,
  }: {
    title: string;
    description: string;
    severity: 'Severe' | 'High' | 'Medium' | 'Low';
  }) => void;
}

export default function CreateJob({
  isOpen,
  setIsOpen,
  setJobDetails,
}: CreateJobProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [severity, setSeverity] = useState<
    'Severe' | 'High' | 'Medium' | 'Low'
  >('Medium');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setJobDetails({ title: jobTitle, description: jobDescription, severity });
    setIsOpen(false);
  };

  const handleSeverityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.value) {
      case 'Severe':
        setSeverity('Severe');
        break;
      case 'High':
        setSeverity('High');
        break;
      case 'Medium':
        setSeverity('Medium');
        break;
      case 'Low':
        setSeverity('Low');
        break;
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-my-color6 shadow-xl"
                    onSubmit={handleSubmit}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-my-color8 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Create a New Job
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-my-color7 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-my-color1">
                            Get started by filling in the information below to
                            define this new job.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-my-color1"
                              >
                                Job title
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="project-name"
                                  id="project-name"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  value={jobTitle}
                                  placeholder="Enter a job title"
                                  onChange={(e) => setJobTitle(e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-my-color1"
                              >
                                Description
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  defaultValue={''}
                                  placeholder="Give a brief description of the job."
                                  value={jobDescription}
                                  onChange={(e) =>
                                    setJobDescription(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium leading-6 text-my-color1">
                                Team Members
                              </h3>
                              <div className="mt-2">
                                <div className="flex space-x-2">
                                  {team.map((person) => (
                                    <a
                                      key={person.email}
                                      href={person.href}
                                      className="relative rounded-full hover:opacity-75"
                                    >
                                      <img
                                        className="inline-block h-8 w-8 rounded-full"
                                        src={person.imageUrl}
                                        alt={person.name}
                                      />
                                    </a>
                                  ))}
                                  <button
                                    type="button"
                                    className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  >
                                    <span className="absolute -inset-2" />
                                    <span className="sr-only">
                                      Add team member
                                    </span>
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <fieldset>
                              <legend className="text-sm font-medium leading-6 text-my-color1">
                                Severity
                              </legend>
                              <div className="mt-2 space-y-4">
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="severe"
                                      name="severity"
                                      type="radio"
                                      value="Severe"
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      checked={severity === 'Severe'}
                                      onChange={handleSeverityChange}
                                    />
                                  </div>
                                  <div className="flex gap-2 pl-7 text-sm leading-6 items-center">
                                    <ChevronDoubleUpIcon className="h-4 w-4" />
                                    <label
                                      htmlFor="privacy-public"
                                      className="font-medium text-my-color1"
                                    >
                                      Severe
                                    </label>
                                  </div>
                                </div>
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="high"
                                      name="severity"
                                      type="radio"
                                      value="High"
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      checked={severity === 'High'}
                                      onChange={handleSeverityChange}
                                    />
                                  </div>
                                  <div className="flex gap-2 pl-7 text-sm leading-6 items-center">
                                    <ChevronUpIcon className="h-4 w-4" />
                                    <label
                                      htmlFor="privacy-public"
                                      className="font-medium text-my-color1"
                                    >
                                      High
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="medium"
                                        name="severity"
                                        type="radio"
                                        value="Medium"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        checked={severity === 'Medium'}
                                        onChange={handleSeverityChange}
                                        defaultChecked
                                      />
                                    </div>
                                    <div className="flex gap-2 pl-7 text-sm leading-6 items-center">
                                      <Bars2Icon className="h-4 w-4" />
                                      <label
                                        htmlFor="privacy-private-to-project"
                                        className="font-medium text-my-color1"
                                      >
                                        Medium
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="low"
                                        name="severity"
                                        type="radio"
                                        value="Low"
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        checked={severity === 'Low'}
                                        onChange={handleSeverityChange}
                                      />
                                    </div>
                                    <div className="flex gap-2 pl-7 text-sm leading-6 items-center">
                                      <ChevronDownIcon className="h-4 w-4" />
                                      <label
                                        htmlFor="privacy-private"
                                        className="font-medium text-my-color1"
                                      >
                                        Low
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          <div className="pb-6 pt-4">
                            <div className="flex text-sm">
                              <a
                                href="#"
                                className="group inline-flex items-center font-medium text-my-color1 hover:text-indigo-900"
                              >
                                <LinkIcon
                                  className="h-5 w-5 text-my-color1 group-hover:text-indigo-900"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">Copy link</span>
                              </a>
                            </div>
                            <div className="mt-4 flex text-sm">
                              <a
                                href="#"
                                className="group inline-flex items-center text-my-color1 hover:text-gray-900"
                              >
                                <QuestionMarkCircleIcon
                                  className="h-5 w-5 text-my-color1 group-hover:text-my-color1"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">
                                  Learn more about sharing
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
