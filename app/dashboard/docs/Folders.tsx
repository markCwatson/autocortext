import { TreeItem, TreeView } from '@/components/Tree';

interface FoldersProps {
  callback: (path: string) => void;
}

export default function Folders({ callback }: FoldersProps) {
  return (
    <>
      {/** standards */}
      <TreeView>
        <TreeItem
          label="standards"
          showIcons={true}
          isOpen={false}
          isFolder={true}
        >
          <TreeItem label="iso9001" showIcons={true} isFolder={true}>
            <TreeItem label="iso9001_2020.pdf" showIcons={false} />
          </TreeItem>
        </TreeItem>
      </TreeView>
      {/** machines */}
      <TreeView>
        <TreeItem
          label="machines"
          showIcons={true}
          isOpen={true}
          isFolder={true}
        >
          <TreeItem label="cartoners" showIcons={true} isFolder={true}>
            <TreeItem
              label="endload_cartoner.pdf"
              showIcons={false}
              onSelect={() => callback('endload_cartoner.pdf')}
            />
          </TreeItem>
          <TreeItem label="conveyers" showIcons={true} isFolder={true}>
            <TreeItem
              label="siptu.pdf"
              showIcons={false}
              onSelect={() => callback('siptu.pdf')}
            />
            <TreeItem
              label="plc_logic.pdf"
              showIcons={false}
              onSelect={() => callback('plc_logic.pdf')}
            />
            <TreeItem
              label="electrical_schematics.pdf"
              showIcons={false}
              onSelect={() => callback('electrical_schematics.pdf')}
            />
          </TreeItem>
          <TreeItem label="lathes" showIcons={true} isFolder={true}>
            <TreeItem
              label="bench_lathe.pdf"
              showIcons={false}
              onSelect={() => callback('bench_lathe.pdf')}
            />
          </TreeItem>
          <TreeItem label="drill_presses" showIcons={true} isFolder={true} />
          <TreeItem label="welders" showIcons={true} isFolder={true} />
          <TreeItem label="cnc" showIcons={true} isFolder={true} />
        </TreeItem>
      </TreeView>
    </>
  );
}
