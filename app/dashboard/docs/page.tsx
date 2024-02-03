'use client';

import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useSession } from 'next-auth/react';
import Search from '@/components/Search';
import FileUpload from '@/components/FileUpload';
import Folders from './Folders';
import AiHeader from '@/components/AiHeader';
import { AiMessage, useQueryContext } from '@/components/AiMessagesProvider';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toast';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import AiPromptChat from '@/components/AiPromptChat';
import { AiMessageList } from '@/components/AiMessageList';

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

const navBarHeight = '170px';

const mainContainerStyle: CSSProperties = {
  height: `calc(100vh - ${navBarHeight})`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const columnStyle: CSSProperties = {
  height: '100%',
};

export default function Documentation() {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const session = useSession();

  const { messages, setMessages } = useQueryContext();

  useEffect(() => {
    if (session.data?.user.name && messages.length === 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${prevMessages.length + 1}`,
          content: `Auto Cortext: Hi ${session.data.user.name}, how can I help you?`,
          role: 'assistant',
        },
      ]);
    }
  }, [session]);

  async function sendQuery(e: any, newMessage: AiMessage) {
    e.preventDefault();
    if (!messages) return;
    const context = [...messages, newMessage]
      .map((message) => message.content)
      .join('\n');

    setLoading(true);

    toast({
      title: 'Success',
      message: `Sending query...`,
      duration: 2000,
    });

    try {
      const result = await fetch('/api/read', {
        method: 'POST',
        body: JSON.stringify(context),
      });

      if (!result?.ok) {
        return toast({
          title: 'Error',
          message: `Server status code: ${result.status}`,
          type: 'error',
        });
      }

      const json = await result.json();
      if (json.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `${prevMessages.length + 1}`,
            content: `Auto Cortext: ${json.data}`,
            role: 'assistant',
          },
        ]);

        toast({
          title: 'Success',
          message: `Answer received!`,
          duration: 3000,
        });
      }
    } catch (err) {
      console.log('err:', err);
      toast({
        title: 'Error',
        message: 'Error sending query. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
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
    'endload_cartoner.pdf': '/HS5160-SFC-ENT-117&118.pdf',
    // 'https://t3xziqgvuko9aizs.public.blob.vercel-storage.com/HS5160-SFC-ENT-117&118-GkTYoB4zg1F4kOcXAo5aiXNivX1F0T.pdf',
    'siptu.pdf': '/HS5160-SFC-WSIPTU-115&116.pdf',
    // 'https://t3xziqgvuko9aizs.public.blob.vercel-storage.com/HS5160-SFC-WSIPTU-115&116-jKpTudlZJFbkNvgVrp1p0mhpt9b5o4.pdf',
    'bench_lathe.pdf': '/fervi_bench_lathe.pdf',
    // 'https://t3xziqgvuko9aizs.public.blob.vercel-storage.com/fervi_bench_lathe-8VpQpc7JyZ0g9yapQE8Zc8jI4jEnV7.pdf',
  };

  const handleSelectDocument = (file: string) => {
    setSelectedDocument(docMap[file]);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${prevMessages.length + 1}`,
        content: `Auto Cortext: Perfect. Ask me about the file ${file}`,
        role: 'assistant',
      },
    ]);
  };

  return (
    <div className="bg-my-color8">
      <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
        <div
          className="grid pt-2 grid-cols-1 lg:grid-cols-7 gap-x-4 gap-y-10"
          style={columnStyle}
        >
          {/** Folders/files */}
          <div className="pb-8 lg:col-span-2 bg-my-color7 border rounded overflow-scroll">
            <div className="flex justify-between items-center py-1 border-b">
              <div className="ml-2 cursor-pointer text-my-color1 hover:bg-my-color5 hover:text-my-color9">
                <FileUpload
                  buttonType="outline"
                  buttonSize="default"
                  id="file-upload-1"
                  text="Upload"
                  icon={<ArrowUpTrayIcon className="w-4 h-4 mx-auto mr-2" />}
                />
              </div>
              <Search />
            </div>
            <div className="flex flex-col">
              <div className="pt-4 overflow-scroll">
                <Folders callback={handleSelectDocument} />
              </div>
            </div>
          </div>
          {/** PDF */}
          <div className="lg:col-span-3 border rounded">
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
          {/** AI prompt */}
          <div className="pb-8 lg:col-span-2 bg-my-color7 border rounded overflow-scroll">
            <AiHeader
              dropDownList={[
                'auto-cortext-rev-0.0.1', // 'gpt-3.5-turbo-instruct',
                'auto-cortext-rev-0.1.2', // 'gpt-3.5-turbo-1106',
                'auto-cortext-rev-1.0.0', // gpt-4-1106-preview',
              ]}
              messages={messages}
            />
            <div className="flex flex-col justify-center w-full h-full">
              <AiMessageList messages={messages} />
              <div className="w-full px-4">
                <AiPromptChat callback={sendQuery} isLoading={loading} />
              </div>
              {/* todo: for now, remove this button from the UI once the embeddings are created ... 
                ... will add a button to upload a pdf and create the embeddings from that
                */}
              {/* <CreateEmbeddings /> */}
              {/* <UploadPdf /> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
