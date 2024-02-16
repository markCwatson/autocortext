'use client';

import React, { useEffect, useState, CSSProperties } from 'react';
import { useSession } from 'next-auth/react';
import Search from '@/components/Search';
import FileUpload from '@/components/FileUpload';
import Folders from './Folders';
import AiHeader from '@/components/AiHeader';
import { AiMessage, useQueryContext } from '@/providers/AiMessagesProvider';
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
    'siptu.pdf': '/HS5160-SFC-WSIPTU-115&116.pdf',
    'bench_lathe.pdf': '/fervi_bench_lathe.pdf',
    'electrical_schematics.pdf': '/SIPTU-Electrical-Schematics.pdf',
    'plc_logic.pdf': '/SIPTU-PLC-Logic.pdf',
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
            <AiHeader messages={messages} />
            <div className="flex flex-col justify-center w-full h-full">
              <AiMessageList messages={messages} />
              <div className="w-full px-4">
                <AiPromptChat callback={sendQuery} isLoading={loading} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
