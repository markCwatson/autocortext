'use client';

import React, { useState } from 'react';
import { TreeItem, TreeView } from '@/components/Tree';

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
  const [selectedDocument, setSelectedDocument] = useState<string>('');

  const handleSelectDocument = (documentPath: string) => {
    setSelectedDocument(documentPath);
  };

  return (
    <div className="bg-my-color8">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid pt-2 grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="sticky top-0 pt-10 lg:col-span-1 bg-my-color7">
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
                    label="manual.pdf"
                    showIcons={false}
                    onSelect={() => handleSelectDocument('/example.pdf')}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
          <div className="lg:col-span-3">
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
