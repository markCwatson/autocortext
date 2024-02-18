'use client';

import React, { useState } from 'react';
import { TreeItem, TreeView } from '@/components/Tree';
import { FILE, FOLDER } from '@/lib/constants';
import { DocModel } from '@/repos/DocRepository';
import { Loader2 } from 'lucide-react';

interface FoldersProps {
  selectDoc: (url: string, name: string) => void;
  docs: DocModel[] | null;
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

export default function DocStructure({
  selectDoc,
  docs,
  fetchDocs,
  onDeleteDoc,
}: FoldersProps) {
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({
    '/': true,
  });

  const toggleNode = (path: string) => {
    setOpenNodes((prevOpenNodes) => ({
      ...prevOpenNodes,
      [path]: !prevOpenNodes[path],
    }));
  };

  const renderTreeItems = (
    selectDoc: (url: string, name: string) => void,
    nodes: DocModel[],
  ) => {
    return nodes.map((node) => (
      <TreeItem
        key={node.path}
        label={node.name}
        isFolder={node.type === FOLDER}
        // @ts-ignore
        parentId={node.parentId as string}
        // @ts-ignore
        id={node._id as string}
        path={node.path}
        showIcons={true}
        isOpen={!!openNodes[node.path]}
        fetchDocs={fetchDocs}
        onDeleteDoc={onDeleteDoc}
        onSelect={() => {
          if (node.type === FOLDER) {
            toggleNode(node.path);
          } else {
            selectDoc(node.url, node.name);
          }
        }}
      >
        {node.children && renderTreeItems(selectDoc, node.children)}
      </TreeItem>
    ));
  };

  return (
    <div>
      {docs ? (
        <TreeView>{renderTreeItems(selectDoc, docs)}</TreeView>
      ) : (
        <div className="flex justify-center items-center h-14">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </div>
      )}
    </div>
  );
}
