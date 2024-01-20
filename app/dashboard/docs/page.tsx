'use client';

import React, { useEffect, useState, useRef } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import AnimatedText from '@/components/AnimatedText';
import { useSession } from 'next-auth/react';
import Search from '@/components/Search';
import FileUpload from '@/components/FileUpload';
import Folders from './Folders';
import AiHeader from '@/components/AiHeader';
import AiPromptSimple from '@/components/AirPromptSimple';
import { useQueryContext } from '@/components/AiQueryProvider';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';
import { ArrowUpIcon } from '@heroicons/react/20/solid';

const iFrameHeight = '100%';
const iFrameWidth = '100%';

const placeholderStyle = {
  width: iFrameWidth,
  height: iFrameHeight,
  backgroundColor: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',
  fontSize: '1rem',
};

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
        className="mt-4"
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

export default function Documentation() {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const session = useSession();

  const { interaction, setInteraction } = useQueryContext();

  useEffect(() => {
    if (session.data?.user.name) {
      setInteraction({
        ...interaction,
        answer: `Hello ${session.data.user.name}. Select a document so we can get started.`,
      });
    }
  }, [session]);

  async function sendQuery() {
    if (!interaction.question) return;
    setInteraction({ ...interaction, loading: true });
    toast({
      title: 'Success',
      message: `Sending query: ${interaction.question}`,
      duration: 2000,
    });
    try {
      const result = await fetch('/api/read', {
        method: 'POST',
        body: JSON.stringify(interaction.question),
      });
      const json = await result.json();
      setInteraction({ ...interaction, answer: json.data, loading: false });
      if (json.data) {
        toast({
          title: 'Success',
          message: `Answer received!`,
          duration: 3000,
        });
      }
    } catch (err) {
      console.log('err:', err);
      setInteraction({ ...interaction, loading: false });
      toast({
        title: 'Error',
        message: 'Error sending query. Please try again later.',
        type: 'error',
      });
    }
  }

  // todo: link urls to accounts and remove this
  useEffect(() => {
    console.log('selectedDocument: ', selectedDocument);
  }, [selectedDocument]);

  interface DocMap {
    [key: string]: string;
  }

  const docMap: DocMap = {
    'HS5160-SFC-ENT-117&118.pdf': '/HS5160-SFC-ENT-117&118.pdf',
    // 'https://t3xziqgvuko9aizs.public.blob.vercel-storage.com/HS5160-SFC-ENT-117&118-GkTYoB4zg1F4kOcXAo5aiXNivX1F0T.pdf',
    'HS5160-SFC-WSIPTU-115&116.pdf': '/HS5160-SFC-WSIPTU-115&116.pdf',
    // 'https://t3xziqgvuko9aizs.public.blob.vercel-storage.com/HS5160-SFC-WSIPTU-115&116-jKpTudlZJFbkNvgVrp1p0mhpt9b5o4.pdf',
    'fervi_bench_lathe.pdf': '/fervi_bench_lathe.pdf',
    // 'https://t3xziqgvuko9aizs.public.blob.vercel-storage.com/fervi_bench_lathe-8VpQpc7JyZ0g9yapQE8Zc8jI4jEnV7.pdf',
  };

  const handleSelectDocument = (file: string) => {
    setSelectedDocument(docMap[file]);
    setInteraction({
      ...interaction,
      answer: `Perfect. Ask me about the file ${file}`,
    });
  };

  return (
    <div className="bg-my-color8">
      <main className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-2 grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="pb-8 lg:col-span-2 bg-my-color7 border rounded">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <div className="cursor-pointer text-my-color1 hover:bg-my-color5 hover:text-my-color9">
                <FileUpload
                  buttonType="outline"
                  buttonSize="default"
                  id="file-upload-1"
                  text="Upload File"
                  icon={<ArrowUpIcon className="w-4 h-4 mx-auto mr-2" />}
                />
              </div>
              <Search />
            </div>
            <div className="flex flex-col">
              <div
                className="pt-4 border-b overflow-scroll"
                style={{ height: '30vh' }}
              >
                <Folders callback={handleSelectDocument} />
              </div>
              {/** AI prompt */}
              <AiHeader
                dropDownList={[
                  'gpt-3.5-turbo-instruct',
                  'gpt-3.5-turbo-1106',
                  'gpt-4-1106-preview',
                ]}
                report={interaction.answer}
              />
              <div className="mt-2 flex flex-col justify-center items-center w-full h-full">
                <p
                  className="my-8 p-8 border rounded bg-my-color1 text-my-color9"
                  style={{ width: '80%' }}
                >
                  {interaction.answer && (
                    <AnimatedText
                      text={interaction.answer}
                      show={true}
                      animated={true}
                      animationDelay={500}
                    />
                  )}
                </p>
                <AiPromptSimple callback={sendQuery} />
                {/* todo: for now, remove this button from the UI once the embeddings are created ... 
                ... will add a button to upload a pdf and create the embeddings from that
                */}
                {/* <CreateEmbeddings /> */}
                {/* <UploadPdf /> */}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 border rounded">
            {selectedDocument ? (
              <iframe
                src={selectedDocument}
                style={{ width: iFrameWidth, height: iFrameHeight }}
              />
            ) : (
              <div style={placeholderStyle}>
                Please select a document to view
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
