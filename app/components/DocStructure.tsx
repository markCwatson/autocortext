import { TreeItem, TreeView } from '@/components/Tree';
import { FOLDER } from '@/lib/constants';
import { DocModel } from '@/repos/DocRepository';
import { Doc } from '@/types';
import { Loader2 } from 'lucide-react';

interface FoldersProps {
  selectDoc: (path: string) => void;
  docs: DocModel[] | null;
}

const renderTreeItems = (nodes: Doc[]) => {
  return nodes.map((node) => (
    <TreeItem
      key={node.path} // Assuming each node has a unique path or id
      label={node.name}
      isFolder={node.type === FOLDER}
      parentId={node.parentId as string}
      parentPath={node.parentPath}
      showIcons={true}
      isOpen={true}
      onSelect={() => {
        // Handle selection (e.g., open folder or file)
      }}
    >
      {node.children && renderTreeItems(node.children)}
    </TreeItem>
  ));
};

export default function DocStructure({ selectDoc, docs }: FoldersProps) {
  return (
    <div>
      {docs ? (
        <TreeView>{renderTreeItems(docs)}</TreeView>
      ) : (
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
      )}
    </div>
  );
}
