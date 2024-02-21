'use client';

import React from 'react';
import { useRef, useState } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { Button } from '@/components/Button';
import { useUserContext } from '@/providers/UserProvider';
import { toast } from '@/components/Toast';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { mainContainerStyle } from '@/lib/mainContainerStyle';
import { uploadFileToS3 } from '@/lib/s3';

function CreateEmbeddings() {
  const userValue = useUserContext();

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButton = () => {
    fileInputRef.current?.click();
  };

  const addFileToDatabase = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    setLoading(true);

    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const { success, name } = await uploadFileToS3(file);
      if (!success) {
        toast({
          title: 'Error',
          message: 'Error uploading file to s3',
          type: 'error',
        });
        return;
      }

      const response = await fetch(
        `/api/doc?companyId=${userValue.user.companyId}&type=file`,
        {
          method: 'POST',
          body: JSON.stringify({
            parentId: '65cff453c606335be2a8836c', // id of root folder
            parentPath: '/',
            name,
          }),
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error',
          message: 'Error uploading file to database',
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
      setLoading(false);
    }
  };

  async function createIndexAndEmbeddings() {
    setLoading(true);
    try {
      await fetch('/api/setup', {
        method: 'POST',
      });

      toast({
        title: 'Success',
        message: 'Index and embeddings created',
        type: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        message: 'Failed to create index and embeddings',
        type: 'error',
      });
    }

    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <div className="animate-spin">
          <ArrowPathIcon
            className="h-6 w-6 text-green-600 animate-spin"
            aria-hidden="true"
          />
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            accept=".txt"
            style={{ display: 'none' }}
            onChange={addFileToDatabase}
          />
          <Button
            className="w-[400px] mt-2"
            variant="outline"
            onClick={handleButton}
          >
            Create index and embeddings
          </Button>
        </>
      )}
    </>
  );
}

function UploadPdf() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return (
    <>
      <form
        className="mt-4 border-2 border-dashed border-my-color2 p-4 rounded-md"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];

          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });

          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}

function Embed() {
  const userCxt = useUserContext();

  if (userCxt?.user.role !== 'AscendAdmin') {
    return (
      <div className="flex flex-col h-full w-full gap-4 justify-center items-center">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
      <div className="h-full w-full">
        <div className="h-full w-full grid p-2 grid-cols-4 gap-x-4 gap-y-10">
          <div className="bg-transparent col-span-1" />
          <div className="lg:col-span-2">
            <div className="h-full flex flex-col gap-4 justify-center items-center text-center">
              Instructions
              <ol className="list-decimal list-inside text-left space-y-2 text-sm">
                <li>
                  To create vector embeddings from TXT docs, place them in the{' '}
                  <code className="font-mono px-2 py-1 rounded">
                    /scripts/convert/text
                  </code>{' '}
                  folder.
                </li>
                <li>
                  The text files will be taken from the{' '}
                  <code className="font-mono px-2 py-1 rounded">
                    /scripts/convert/text
                  </code>{' '}
                  folder, used to create vector embeddings, and uploaded to
                  Pinecone.
                </li>
                <li>
                  Once the process is completed, move the text file(s) into the{' '}
                  <code className="font-mono px-2 py-1 rounded">
                    /scripts/convert/completed
                  </code>{' '}
                  folder and compress them.
                </li>
                <li>
                  Pinecone is eventually consistent, meaning there can be a
                  delay before your upserted vectors are available to query.
                </li>
                <li>
                  This operation can take a few minutes to complete, depending
                  on the number of text files and the size of the files.
                </li>
              </ol>
              <CreateEmbeddings />
              {/* <UploadPdf /> */}
            </div>
            <div className="bg-transparent col-span-1" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Embed;
