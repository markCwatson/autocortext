import React from 'react';
import { FileIcon, FolderClosed } from 'lucide-react';
import { Button } from '@/components/Button';
import classNames from '@/lib/classNames';
import { FILE, FOLDER } from '@/lib/constants';

interface Props {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setType: (type: typeof FILE | typeof FOLDER) => void;
  setSelectedType: (type: typeof FILE | typeof FOLDER) => void;
}

const DocTypeSelector = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    return (
      <div className="flex justify-evenly gap-8 mx-8">
        <Button
          size={'lg'}
          onClick={() => props.setSelectedType(FOLDER)}
          className={classNames(
            'text-my-color1 hover:bg-my-color4',
            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
            'w-full px-6 justify-start',
          )}
        >
          <FolderClosed className="h-4 w-4 shrink-0" aria-hidden="true" />
          Folder
        </Button>
        <>
          <input
            ref={ref}
            id="file"
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={props.onFileUpload}
          />
          <Button
            size={'lg'}
            onClick={() => {
              props.setType(FILE);
              // Trigger the file input click to open the file dialog
              if (typeof ref === 'object') {
                ref?.current?.click();
              }
            }}
            className={classNames(
              'text-my-color1 hover:bg-my-color4',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
              'w-full px-6 justify-start',
            )}
          >
            <FileIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            File
          </Button>
        </>
      </div>
    );
  },
);

export default DocTypeSelector;
