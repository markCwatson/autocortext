'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/Button';
import { toast } from './Toast';

interface FileUploadProps {
  buttonType: 'outline' | 'ghost';
  icon?: React.ReactNode;
  text: string;
  buttonSize: 'default' | 'sm' | 'lg' | 'nill';
  companyId: string;
}

export default function FileUpload({
  buttonType,
  icon,
  text,
  buttonSize,
  companyId,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/pdf?companyId=${companyId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        toast({
          title: 'Error',
          message: `Server status code: ${response.status}`,
          type: 'error',
        });
        return;
      }

      toast({
        title: 'Success',
        message: 'File uploaded successfully',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        message: `Error uploading file: ${error.message}`,
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    uploadFile(file);
  };

  const handleButtonClick = () => {
    if (uploading) {
      toast({
        title: 'Info',
        message: 'Upload in progress. Please wait...',
        type: 'success',
      });
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        id="file"
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant={buttonType}
        size={buttonSize}
        onClick={handleButtonClick}
        disabled={uploading}
      >
        <div className="flex items-center text-center cursor-pointer">
          {icon}
          {text}
        </div>
      </Button>
    </>
  );
}
