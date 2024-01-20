'use client';

import { FileIcon, FolderClosed, FolderOpen } from 'lucide-react';
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import DialogModal from '@/components/DialogModal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from '@/components/Toast';
import FileUpload from '@/components/FileUpload';

interface TreeItemProps {
  label: string;
  children?: React.ReactNode;
  onSelect?: () => void;
  showIcons?: boolean;
  isOpen?: boolean;
  isFolder?: boolean;
}

const TreeItem = ({
  label,
  children,
  onSelect,
  showIcons,
  isOpen,
  isFolder,
}: TreeItemProps) => {
  const [open, setOpen] = useState(isOpen);
  const [deleteSomething, setDeleteSomething] = useState({
    folder: false,
    file: false,
  });
  const expand = useSpring({ height: open ? 'auto' : 0 });

  function handleDelete(isDelete: boolean) {
    const { folder } = deleteSomething;
    setDeleteSomething({ folder: false, file: false });
    if (!isDelete) return;

    // doesn't actually delete anything
    toast({
      title: 'Deleted',
      message: `Successfully deleted ${folder ? 'folder' : 'file'}`,
      type: 'success',
    });
  }

  if (deleteSomething.folder || deleteSomething.file) {
    return (
      <DialogModal
        icon={
          <ExclamationTriangleIcon
            className="h-10 w-10 text-orange-600"
            aria-hidden="true"
          />
        }
        title={`Delete ${deleteSomething.folder ? 'folder' : 'file'}`}
        body={'Are you sure? This cannot be undone.'}
        show={true}
        onClose={'/dashboard/docs'}
        goToButtons={[
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleDelete(false)}
          >
            Cancel
          </button>,
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleDelete(true)}
          >
            Confirm
          </button>,
        ]}
      />
    );
  }

  function handleClick() {
    if (onSelect) {
      onSelect();
      return;
    }
    setOpen(!open);
  }

  return (
    <div className="flex flex-col">
      <div className="group flex p-1 items-center cursor-pointer hover:bg-my-color5 ">
        {showIcons ? (
          open ? (
            <FolderOpen onClick={handleClick} />
          ) : (
            <FolderClosed onClick={handleClick} />
          )
        ) : null}
        {!isFolder ? (
          <FileIcon
            style={{
              padding: '3px',
            }}
            onClick={handleClick}
          />
        ) : null}
        <span className="pl-2" onClick={handleClick}>
          {label}
        </span>
        <div className="flex ml-auto invisible group-hover:visible">
          {isFolder ? (
            <FileUpload
              buttonType="ghost"
              buttonSize="nill"
              id="file-upload-2"
              text=""
              icon={<PlusIcon className="w-5 h-5" />}
            />
          ) : null}
          <TrashIcon
            className="ml-2 w-5 h-5"
            onClick={() =>
              setDeleteSomething({ file: !!!isFolder, folder: !!isFolder })
            }
          />
        </div>
      </div>
      <animated.div style={expand} className="pl-8 overflow-hidden">
        {children}
      </animated.div>
    </div>
  );
};

interface TreeViewProps {
  children?: React.ReactNode;
}

const TreeView = ({ children }: TreeViewProps) => {
  return <div className="px-8">{children}</div>;
};

export { TreeView, TreeItem };
