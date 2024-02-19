'use client';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useUserContext } from '@/providers/UserProvider';
import { toast } from '@/components/Toast';
import { Button } from '@/components/Button';
import DocModal from '@/components/DocModal';

interface FileUploadProps {
  parentId: string;
  parentPath: string;
  fetchDocs: (companyId: string) => void;
}

export default function DocUpload({
  parentId,
  parentPath,
  fetchDocs,
}: FileUploadProps) {
  const userValue = useUserContext();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFileToS3 = async (file: File) => {
    const fileName = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;

    // Request a signed URL from API
    const response = await fetch('/api/doc/s3-upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      toast({
        title: 'Error',
        message: 'Failed to get signed URL from server',
        type: 'error',
      });
    }

    const { url } = await response.json();

    // Use the signed URL to upload the file to S3
    // Note: cors was enabled on the S3 bucket to allow PUT requests
    const s3Response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!s3Response.ok) {
      toast({
        title: 'Error',
        message: 'Failed to upload file to S3',
        type: 'error',
      });
    }

    return { success: true, name: fileName };
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setUploading(true);
      const { success, name } = await uploadFileToS3(file);
      if (success) {
        const result = await addFileToDatabase(name);
        if (!result) {
          toast({
            title: 'Error',
            message: 'Error uploading file to database',
            type: 'error',
          });
        } else {
          toast({
            title: 'Success',
            message: 'File uploaded successfully',
            type: 'success',
          });

          const res = await fetch(
            `/api/notify?companyId=${userValue.user.companyId}`,
            {
              method: 'POST',
              body: JSON.stringify({
                title: `${userValue.user.name} uploaded a file`,
                description: `${userValue.user.name} uploaded the file ${name} to ${parentPath}`,
                recipientId: null,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          if (!res.ok) {
            toast({
              title: 'Error',
              message: `Failed to send notification to company`,
              type: 'error',
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        message: `Error uploading file: ${error.message}`,
        type: 'error',
      });
    } finally {
      setUploading(false);
      setIsOpenModal(false);
      fetchDocs(userValue.user.companyId as string);
    }
  };

  const addFileToDatabase = async (name: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/doc?companyId=${userValue.user.companyId}&type=file`,
        {
          method: 'POST',
          body: JSON.stringify({
            parentId,
            parentPath,
            name,
          }),
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error',
          message: `Server status code: ${response.status}`,
          type: 'error',
        });
      }

      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        message: `Error uploading file: ${error.message}`,
        type: 'error',
      });
      return false;
    }
  };

  const uploadFolder = async (folderName: string) => {
    setUploading(true);

    try {
      const response = await fetch(
        `/api/doc?companyId=${userValue.user.companyId}&type=folder`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: folderName,
            parentId,
            parentPath,
            path: `${parentPath}/${folderName}`,
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
      fetchDocs(userValue.user.companyId as string);
    }
  };

  const handleFolderCreation = (folderName: string) => {
    uploadFolder(folderName);
    setIsOpenModal(false);
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

    setIsOpenModal(true);
  };

  if (isOpenModal) {
    return (
      <DocModal
        show={isOpenModal}
        isUploading={uploading}
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
