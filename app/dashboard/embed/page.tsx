'use client';

import React from 'react';
import { useRef, useState } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { Button } from '@/components/Button';
import { useUserContext } from '@/components/UserProvider';

function CreateEmbeddings() {
  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch('/api/setup', {
        method: 'POST',
      });
      const json = await result.json();
      console.log('result: ', json);
    } catch (err) {
      console.log('err:', err);
    }
  }

  return (
    <Button
      className="w-[400px] mt-2"
      variant="outline"
      onClick={createIndexAndEmbeddings}
    >
      Create index and embeddings
    </Button>
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

  if (userCxt?.user.name !== 'mark') {
    return (
      <div className="flex flex-col h-full w-full gap-4 justify-center items-center">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-4 justify-center items-center">
      Be sure tou know what you are doing here...
      This functionality is only for testing purposes.
    <CreateEmbeddings />
    <UploadPdf />
    </div>
  );
}

export default Embed;
