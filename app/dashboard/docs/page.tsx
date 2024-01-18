'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import AnimatedText from '@/components/AnimatedText';
import { useSession } from 'next-auth/react';
import Search from '@/components/Search';
import FileUpload from '@/components/FileUpload';
import Folders from './Folders';
import AiHeader from '@/components/AiHeader';

const iFrameHeight = '75vh';
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

export default function Documentation() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const session = useSession();

  useEffect(() => {
    if (session.data?.user.name) {
      if (selectedDocument) {
        setResult(`Perfect. Ask me about the Fervi Bench Lathe.`);
      } else {
        setResult(
          `Hello ${session.data.user.name}. Select a document so we can get started.`,
        );
      }
    }
  }, [session, selectedDocument]);

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

  async function sendQuery() {
    if (!query) return;
    setResult('');
    setLoading(true);
    try {
      const result = await fetch('/api/read', {
        method: 'POST',
        body: JSON.stringify(query),
      });
      const json = await result.json();
      setResult(json.data);
      setLoading(false);
    } catch (err) {
      console.log('err:', err);
      setLoading(false);
    }
  }

  const handleSelectDocument = (documentPath: string) => {
    setSelectedDocument(documentPath);
  };

  return (
    <div className="bg-my-color8">
      <main className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-2 grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="lg:col-span-2 bg-my-color7 border rounded">
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
                report={result}
              />
              <div className="mt-10 flex flex-col justify-center items-center w-full h-full">
                <input
                  className="mt-3 rounded border w-[400px] text-black px-2 py-1"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter query here..."
                />
                <Button className="w-[400px] mt-3" onClick={sendQuery}>
                  Ask AscendAI
                </Button>
                {loading && (
                  <ChartPieIcon className="my-5 w-8 h-8 animate-spin" />
                )}
                {/* todo: for now, remove this button from the UI once the embeddings are created ... 
                ... will add a button to upload a pdf and create the embeddings from that
                */}
                {/* <Button
                      className="w-[400px] mt-2"
                      variant="outline"
                      onClick={createIndexAndEmbeddings}
                    >
                    Create index and embeddings
                    </Button> */}
                <p
                  className="my-8 border p-8 rounded bg-my-color1 text-my-color9"
                  style={{ width: '80%' }}
                >
                  {result && (
                    <AnimatedText
                      text={result}
                      show={true}
                      animated={true}
                      animationDelay={500}
                    />
                  )}
                </p>
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
