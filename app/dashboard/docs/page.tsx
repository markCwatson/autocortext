'use client';

import React, { useEffect, useState } from 'react';
import { TreeItem, TreeView } from '@/components/Tree';
import { Button } from '@/components/Button';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import AnimatedText from '@/components/AnimatedText';
import { useSession } from 'next-auth/react';

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

function Documentation() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useSession();

  useEffect(() => {
    if (session.data?.user.name) {
      setResult(
        `Hello ${session.data.user.name}. Ask me about the Fervi Bench Lathe.`,
      );
    }
  }, [session]);

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

  const [selectedDocument, setSelectedDocument] = useState<string>('');

  const handleSelectDocument = (documentPath: string) => {
    setSelectedDocument(documentPath);
  };

  return (
    <div className="bg-my-color8">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid pt-2 grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="lg:col-span-2 bg-my-color7 border rounded">
            <div className="flex flex-col px-4 py-2">
              <div className="sticky top-0 pt-10 ">
                <TreeView>
                  <TreeItem label="/" showIcons={true} isOpen={true}>
                    <TreeItem label="/usr" showIcons={true}>
                      <TreeItem label="/bin" showIcons={true} />
                      <TreeItem label="/lib" showIcons={true} />
                      <TreeItem label="/local" showIcons={true} />
                      <TreeItem label="/share" showIcons={true} />
                    </TreeItem>
                    <TreeItem label="/etc" showIcons={true} />
                    <TreeItem label="/opt" showIcons={true} />
                    <TreeItem label="/sbin" showIcons={true} />
                    <TreeItem label="/var" showIcons={true} />
                    <TreeItem label="/tmp" showIcons={true} />
                    <TreeItem label="/documents" showIcons={true}>
                      <TreeItem
                        label="lathe.pdf"
                        showIcons={false}
                        onSelect={() => handleSelectDocument('/lathe.pdf')}
                      />
                    </TreeItem>
                  </TreeItem>
                </TreeView>
              </div>
              {/** AI prompt */}
              {selectedDocument && (
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
                  {result && (
                    <p className="my-8 border p-8 rounded">
                      <AnimatedText
                        text={result}
                        show={true}
                        animated={true}
                        animationDelay={500}
                      />
                    </p>
                  )}
                </div>
              )}
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

export default Documentation;
