'use client';

import {
  FileIcon,
  FolderClosed,
  FolderIcon,
  FolderOpen,
  MinusSquareIcon,
  PlusSquareIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

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
  const expand = useSpring({ height: open ? 'auto' : 0 });

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          if (onSelect) {
            onSelect();
            return;
          }
          setOpen(!open);
        }}
      >
        {showIcons ? open ? <FolderOpen /> : <FolderClosed /> : null}
        {!isFolder ? (
          <FileIcon
            style={{
              padding: '3px',
            }}
          />
        ) : null}
        <span className="ml-2">{label}</span>
      </div>
      <animated.div style={expand} className="ml-8 mt-2 overflow-hidden">
        {children}
      </animated.div>
    </div>
  );
};

interface TreeViewProps {
  children?: React.ReactNode;
}

const TreeView = ({ children }: TreeViewProps) => {
  return <div className="px-8 py-1">{children}</div>;
};

export { TreeView, TreeItem };
