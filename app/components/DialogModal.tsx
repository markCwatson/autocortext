'use client';

import { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';

type Props = {
  icon: JSX.Element;
  title: String;
  body: String;
  show: boolean;
  onClose?: string;
  goTo?: string;
  goToText?: string;
  goToButtons?: JSX.Element[];
};

export default function DialogModal(props: Props) {
  const [open, setOpen] = useState(props.show);
  const router = useRouter();

  function onClick() {
    if (props.goTo) {
      router.push(props.goTo);
    } else {
      router.push('/');
    }
    setOpen(false);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-md bg-my-color3 dark:bg-my-color10 text-my-color5 hover:bg-my-color8 h-11">
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              router.push(props.onClose ? props.onClose : '/');
              setOpen(false);
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
              <div className="fixed inset-0 bg-my-color9 bg-opacity-90 transition-opacity" />
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-ful">
                        {props.icon}
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {props.title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{props.body}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-5 sm:mt-6 justify-evenly">
                      {props.goToButtons ? (
                        props.goToButtons.map((button) => (
                          <div className="mx-6">{button}</div>
                        ))
                      ) : (
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => onClick()}
                        >
                          {props.goToText}
                        </button>
                      )}
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
