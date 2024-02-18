import React, { useState, useRef } from 'react';
import { FileIcon, FolderClosed } from 'lucide-react';
import { Button } from '@/components/Button';
import classNames from '@/lib/classNames';
import { FILE, FOLDER } from '@/lib/constants';

interface Props {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setType: (type: typeof FILE | typeof FOLDER) => void;
  setSelectedType: (type: typeof FILE | typeof FOLDER) => void;
  onClose: () => void;
}

const DocTypeSelector: React.FC<Props> = (props) => {
  const [isContinueVisible, setIsContinueVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileOptionSelect = () => {
    props.setType(FILE);
    setIsContinueVisible(true);
  };

  const handleContinue = () => {
    fileInputRef.current?.click();
    setIsContinueVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 mx-8">
      {isContinueVisible ? (
        <>
          <p className="text-xs text-my-color8 text-center">
            Auto Cortext will now be trained on this data - accessible only to
            your company. You will receive a notification when the training is
            complete. This can take a few minutes.
          </p>
          <div className="flex justify-evenly w-full gap-4">
            <Button
              size="sm"
              onClick={props.onClose}
              className="p-4 bg-red-600 text-white w-[100px]"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleContinue}
              className="p-4 bg-green-600 w-[100px]"
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-evenly w-full gap-4">
          <Button
            size="default"
            onClick={() => props.setSelectedType(FOLDER)}
            className={classNames(
              'text-my-color1 hover:bg-my-color4',
              'group flex gap-x-3 rounded-md text-sm leading-6 font-semibold',
              'w-[100px] justify-center text-center',
            )}
          >
            <FolderClosed className="h-4 w-4 shrink-0" aria-hidden="true" />
            Folder
          </Button>
          <Button
            size="default"
            onClick={handleFileOptionSelect}
            className={classNames(
              'text-my-color1 hover:bg-my-color4',
              'group flex gap-x-3 rounded-md text-sm leading-6 font-semibold',
              'w-[100px] justify-center text-center',
            )}
          >
            <FileIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            File
          </Button>
        </div>
      )}
      <input
        ref={fileInputRef}
        id="file"
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={props.onFileUpload}
      />
    </div>
  );
};

export default DocTypeSelector;
