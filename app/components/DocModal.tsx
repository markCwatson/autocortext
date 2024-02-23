'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FileIcon, FolderClosed, Loader2 } from 'lucide-react';
import { toast } from '@/components/Toast';
import { FILE, FOLDER } from '@/lib/constants';
import DocCreateFolder from '@/components/DocCreateFolder';
import DocTypeSelector from '@/components/DocTypeSelector';

type Props = {
  show: boolean;
  isUploading: boolean;
  onClose: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderCreation: (folderName: string) => void;
};

export default function DocModal(props: Props) {
  const [selectedType, setSelectedType] = useState<
    typeof FILE | typeof FOLDER | null
  >(null);

  const handleFolderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const folderName = formData.get('folderName');
    if (!folderName) {
      toast({
        title: 'Error',
        message: 'Folder name is required',
        type: 'error',
      });
    }

    props.onFolderCreation(folderName as string);
    props.onClose();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-md bg-my-color3 dark:bg-my-color10 text-my-color5 hover:bg-my-color8 h-11">
        <Transition.Root show={props.show} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={props.onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-my-color9 bg-opacity-95 transition-opacity" />
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
                      {/** Title icons */}
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-ful">
                        <div className="flex gap-4 text-green-600 animate-bounce">
                          <FolderClosed
                            className="h-8 w-8 shrink-0"
                            aria-hidden="true"
                          />
                          {selectedType !== FOLDER && (
                            <FileIcon
                              className="h-8 w-8 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                      {!props.isUploading && (
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            {`Add a new ${
                              selectedType === FOLDER ? FOLDER : 'item'
                            }`}
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {selectedType === FOLDER
                                ? 'Provide the folder name...'
                                : 'Create a folder or add a file...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {!props.isUploading ? (
                      <div className="mt-5">
                        {selectedType === FOLDER ? (
                          <DocCreateFolder
                            handleFolderSubmit={handleFolderSubmit}
                          />
                        ) : (
                          <DocTypeSelector
                            onFileUpload={props.onFileUpload}
                            setSelectedType={setSelectedType}
                            onClose={props.onClose}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center text-my-color10">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        <p className="text-sm">Uploading...</p>
                      </div>
                    )}
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
