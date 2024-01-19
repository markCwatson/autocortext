'use client';

import React, { useEffect, useState } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { useSession } from 'next-auth/react';
import Search from '@/components/Search';
import FileUpload from '@/components/FileUpload';
import Folders from './Folders';
import AiHeader from '@/components/AiHeader';
import AiPromptSimple from '@/components/AirPromptSimple';
import { useQueryContext } from '@/components/AiQueryProvider';
import { Button } from '@/components/Button';

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

export default function Documentation() {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const session = useSession();

  const { interaction, setInteraction } = useQueryContext();

  useEffect(() => {
    if (selectedDocument) {
      setInteraction({
        ...interaction,
        answer: `Perfect. Ask me about the document: ${selectedDocument}`,
      });
    } else {
      if (session.data?.user.name) {
        setInteraction({
          ...interaction,
          answer: `Hello ${session.data.user.name}. Select a document so we can get started.`,
        });
      }
    }
  }, [session, selectedDocument]);

  async function sendQuery() {
    if (!interaction.question) return;
    setInteraction({ ...interaction, loading: true });
    try {
      const result = await fetch('/api/read', {
        method: 'POST',
        body: JSON.stringify(interaction.question),
      });
      const json = await result.json();
      setInteraction({ ...interaction, answer: json.data, loading: false });
    } catch (err) {
      console.log('err:', err);
      setInteraction({ ...interaction, loading: false });
    }
  }

  const handleSelectDocument = (documentPath: string) => {
    setSelectedDocument(documentPath);
  };

  return (
    <div className="bg-my-color8">
      <main className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-2 grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="pb-8 lg:col-span-2 bg-my-color7 border rounded">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <FileUpload />
              <Search />
            </div>
            <div className="flex flex-col">
              <div
                className="pt-4 border-b overflow-auto"
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
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 border rounded">
            {selectedDocument ? (
              <iframe
                src={`/${selectedDocument}`}
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
