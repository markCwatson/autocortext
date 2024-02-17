'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';
import DocModal from '@/components/DocModal';
import { PlusIcon } from '@heroicons/react/20/solid';

interface FileUploadProps {
  companyId: string;
  parentId: string;
  parentPath: string;
}

export default function DocUpload({
  companyId,
  parentId,
  parentPath,
}: FileUploadProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [type, setType] = useState<'file' | 'folder' | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    console.log('formData', formData);
    formData.append('parentId', parentId);
    formData.append('parentPath', parentPath);

    try {
      const response = await fetch(
        `/api/doc?companyId=${companyId}&type=file`,
        {
          method: 'POST',
          body: formData,
        },
      );

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

  const uploadFolder = async (folderName: string) => {
    setUploading(true);

    try {
      const response = await fetch(
        `/api/doc?companyId=${companyId}&type=folder`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: folderName,
            parentId: companyId,
            parentPath: 'parentPath',
            path: 'path',
          }),
        },
      );

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
        message: 'Folder created successfully',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        message: `Error creating folder: ${error.message}`,
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    uploadFile(file);
    setIsOpenModal(false);
    setType(null);
  };

  const handleFolderCreation = (folderName: string) => {
    uploadFolder(folderName);
    setIsOpenModal(false);
    setType(null);
  };

  const handleButtonClick = () => {
    if (!type) {
      setIsOpenModal(true);
      return;
    }

    if (uploading) {
      toast({
        title: 'Info',
        message: 'Upload in progress. Please wait...',
        type: 'success',
      });
      return;
    }
  };

  if (isOpenModal) {
    return (
      <DocModal
        show={isOpenModal}
        setType={setType}
        onClose={() => setIsOpenModal(false)}
        onFileUpload={handleFileUpload}
        onFolderCreation={handleFolderCreation}
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="nill"
      onClick={handleButtonClick}
      disabled={uploading}
    >
      <div className="flex items-center text-center cursor-pointer">
        <PlusIcon className="w-5 h-5 cursor-pointer" />
      </div>
    </Button>
  );
}
