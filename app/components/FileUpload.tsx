'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { toast } from './Toast';

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
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    setFile(event.target.files[0]);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!file) return;
  
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      try { 
        const response = await fetch('/api/pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          toast({
            title: 'Error',
            message: 'Error uploading file.',
            type: 'error',
          });
        }

        toast({
          title: 'Success',
          message: 'File uploaded successfully',
          type: 'success',
        });
      } catch (error) {
        toast({
          title: 'Error',
          message: `Error uploading file: ${error}`,
          type: 'error',
        });
      } finally {
        setUploading(false);
        setFile(undefined);
      }
    }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input
        id='file'
        type='file'
        accept='.pdf'
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button variant={buttonType} size={buttonSize}>
        <label htmlFor='file'>
          <div className='flex items-center text-center cursor-pointer'>
            {icon}
            {text}
          </div>
        </label>
      </Button>
      </form>
    </>
  );
}
