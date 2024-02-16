import { TreeItem, TreeView } from '@/components/Tree';

interface FoldersProps {
  callback: (path: string) => void;
}

export default function DocStructure({ callback }: FoldersProps) {
  return (
    <>
      <TreeView>
        <TreeItem
          label="machines"
          showIcons={true}
          isOpen={true}
          isFolder={true}
        >
          <TreeItem label="cartoners" showIcons={true} isFolder={true}>
            <TreeItem
              label="hs5160_manual.pdf"
              showIcons={false}
              onSelect={() => callback('endload_cartoner.pdf')}
            />
          </TreeItem>
          <TreeItem label="conveyers" showIcons={true} isFolder={true}>
            <TreeItem
              label="siptu_hs5160_manual.pdf"
              showIcons={false}
              onSelect={() => callback('siptu.pdf')}
            />
            <TreeItem
              label="siptu_hs5160_plc.pdf"
              showIcons={false}
              onSelect={() => callback('plc_logic.pdf')}
            />
            <TreeItem
              label="siptu_hs5160_schematics.pdf"
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
        </TreeItem>
      </TreeView>
    </>
  );
}
