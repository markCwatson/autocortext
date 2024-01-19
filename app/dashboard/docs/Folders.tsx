import { TreeItem, TreeView } from '@/components/Tree';

interface FoldersProps {
  callback: (path: string) => void;
}

export default function Folders({ callback }: FoldersProps) {
  return (
    <>
      {/** hr */}
      <TreeView>
        <TreeItem label="hr" showIcons={true} isOpen={false} isFolder={true}>
          <TreeItem label="policies" showIcons={true} isFolder={true}>
            <TreeItem label="safety.pdf" showIcons={false} />
            <TreeItem label="vacation.pdf" showIcons={false} />
          </TreeItem>
        </TreeItem>
      </TreeView>
      {/** standards */}
      <TreeView>
        <TreeItem
          label="standards"
          showIcons={true}
          isOpen={false}
          isFolder={true}
        >
          <TreeItem label="io9001" showIcons={true} isFolder={true}>
            <TreeItem label="ios9001_2020.pdf" showIcons={false} />
          </TreeItem>
        </TreeItem>
      </TreeView>
      {/** tools */}
      <TreeView>
        <TreeItem label="tools" showIcons={true} isOpen={false} isFolder={true}>
          <TreeItem label="screwdrivers" showIcons={true} isFolder={true}>
            <TreeItem label="stanley.pdf" showIcons={false} />
          </TreeItem>
          <TreeItem label="hex" showIcons={true} isFolder={true}>
            <TreeItem label="bosh.pdf" showIcons={false} />
          </TreeItem>
        </TreeItem>
      </TreeView>
      {/** lubricants */}
      <TreeView>
        <TreeItem
          label="oils"
          showIcons={true}
          isOpen={false}
          isFolder={true}
        ></TreeItem>
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
              label="HS5160-SFC-ENT-117&118.pdf"
              showIcons={false}
              onSelect={() => callback('HS5160-SFC-ENT-117&118.pdf')}
            />
          </TreeItem>
          <TreeItem label="conveyers" showIcons={true} isFolder={true}>
            <TreeItem
              label="HS5160-SFC-WSIPTU-115&116.pdf"
              showIcons={false}
              onSelect={() => callback('HS5160-SFC-WSIPTU-115&116.pdf')}
            />
          </TreeItem>
          <TreeItem label="lathes" showIcons={true} isFolder={true}>
            <TreeItem
              label="fervi_bench_lathe.pdf"
              showIcons={false}
              onSelect={() => callback('fervi_bench_lathe.pdf')}
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
