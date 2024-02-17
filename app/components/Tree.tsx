'use client';

import { FileIcon, FolderClosed, FolderOpen } from 'lucide-react';
import React from 'react';
import { useSpring, animated } from 'react-spring';
import { TrashIcon } from '@heroicons/react/20/solid';
import DocUpload from '@/components/DocUpload';
import { useSession } from 'next-auth/react';
import { FILE, FOLDER } from '@/lib/constants';

interface TreeItemProps {
  label: string;
  children?: React.ReactNode;
  onSelect: () => void;
  showIcons: boolean;
  isOpen: boolean;
  isFolder?: boolean;
  id: string;
  path: string;
  fetchDocs: (companyId: string) => void;
  onDeleteDoc: ({
    companyId,
    docId,
    type,
  }: {
    companyId: string;
    docId: string;
    type: typeof FOLDER | typeof FILE;
  }) => void;
}

const TreeItem = ({
  label,
  children,
  onSelect,
  showIcons,
  isOpen,
  isFolder,
  id,
  path,
  fetchDocs,
  onDeleteDoc,
}: TreeItemProps) => {
  const session = useSession();
  const expand = useSpring({ height: isOpen ? 'auto' : 0 });

  return (
    <div className="flex flex-col text-sm ">
      <div className="group flex p-1 items-center hover:bg-my-color5 ">
        {isFolder && showIcons ? (
          isOpen ? (
            <FolderOpen onClick={onSelect} className="cursor-pointer" />
          ) : (
            <FolderClosed onClick={onSelect} className="cursor-pointer" />
          )
        ) : null}
        {!isFolder ? (
          <FileIcon
            style={{
              padding: '3px',
              cursor: 'pointer',
            }}
            onClick={onSelect}
          />
        ) : null}
        <span className="pl-2 cursor-pointer" onClick={onSelect}>
          {label}
        </span>
        <div className="flex ml-auto invisible group-hover:visible">
          {isFolder ? (
            <DocUpload
              fetchDocs={fetchDocs}
              companyId={session.data?.user?.companyId as string}
              parentId={id} // the id is the parent id where doc is being created
              parentPath={path} // the path is the parent path where doc is being created
            />
          ) : null}
          <TrashIcon
            className="ml-2 w-5 h-5 cursor-pointer"
            onClick={() =>
              onDeleteDoc({
                companyId: session.data?.user?.companyId as string,
                docId: id,
                type: isFolder ? FOLDER : FILE,
              })
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
  return <div className="px-4 overflow-visible">{children}</div>;
};

export { TreeView, TreeItem };
