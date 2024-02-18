import React from 'react';
import { Button } from '@/components/Button';

interface Props {
  handleFolderSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function DocCreateFolder({ handleFolderSubmit }: Props) {
  return (
    <form onSubmit={handleFolderSubmit}>
      <div className="flex justify-between">
        <input
          type="text"
          name="folderName"
          placeholder="Folder Name"
          className="text-my-color10"
          required
        />
        <Button type="submit" className="button-class-names">
          Create Folder
        </Button>
      </div>
    </form>
  );
}

export default DocCreateFolder;
