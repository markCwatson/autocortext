'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

interface FileUploadProps {
  buttonType: 'outline' | 'ghost';
  icon?: React.ReactNode;
  text: string;
  buttonSize: 'default' | 'sm' | 'lg' | 'nill';
}

export default function FileUpload({
  buttonType,
  icon,
  text,
  buttonSize,
}: FileUploadProps) {
  const [file, setFile] = useState<File>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    setFile(event.target.files[0]);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (file) {
      // todo: upload file to server
      // see UploadPdf in doc page
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input
        id="file"
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button variant={buttonType} size={buttonSize}>
        <label htmlFor="file">
          <div className="flex items-center text-center cursor-pointer">
            {icon}
            {text}
          </div>
        </label>
      </Button>
      </form>
    </>
  );
}
