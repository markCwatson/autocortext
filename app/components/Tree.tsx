'use client';

import { MinusSquareIcon, PlusSquareIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

interface TreeItemProps {
  label: string;
  children?: React.ReactNode;
  onSelect?: () => void;
  showIcons?: boolean;
  isOpen?: boolean;
}

const TreeItem = ({
  label,
  children,
  onSelect,
  showIcons,
  isOpen,
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
        {showIcons ? (
          open || isOpen ? (
            <MinusSquareIcon />
          ) : (
            <PlusSquareIcon />
          )
        ) : null}
        <span className="ml-2">{label}</span>
      </div>
      <animated.div style={expand} className="ml-6 overflow-hidden">
        {children}
      </animated.div>
    </div>
  );
};

interface TreeViewProps {
  children?: React.ReactNode;
}

const TreeView = ({ children }: TreeViewProps) => {
  return <div className="p-4">{children}</div>;
};

export { TreeView, TreeItem };
