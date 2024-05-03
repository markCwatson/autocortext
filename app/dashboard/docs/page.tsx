'use client';

import React, { useEffect, useState, CSSProperties } from 'react';
import Search from '@/components/Search';
import DocStructure from '@/components/DocStructure';
import AiHeader from '@/components/AiHeader';
import { useQueryContext } from '@/providers/AiMessagesProvider';
import { toast } from '@/components/Toast';
import AiPromptChat from '@/components/AiPromptChat';
import { AiMessageList } from '@/components/AiMessageList';
import { DocModel } from '@/repos/DocRepository';
import { useUserContext } from '@/providers/UserProvider';
import DialogModal from '@/components/DialogModal';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { FOLDER, FILE } from '@/lib/constants';
import { mainContainerStyle } from '@/lib/mainContainerStyle';
import { AiMessage } from '@/types';

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

const columnStyle: CSSProperties = {
  height: '100%',
};

export default function Documentation() {
  const userValue = useUserContext();
  const { messages, setMessages } = useQueryContext();

  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<DocModel[] | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<{
    companyId?: string;
    docId?: string;
    type?: typeof FOLDER | typeof FILE;
  }>({});

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: `Auto Cortext: Hi ${userValue.user.name}, how can I help you?`,
          role: 'assistant',
        },
      ]);
    }

    fetchDocs(userValue.user.companyId as string);
  }, []);

  useEffect(() => {}, [deleteConfig]);

  // depth-first recursive function to find a document by id from children
  const findDocById = (doc: DocModel, docId: string): DocModel | null => {
    if (doc._id.toString() === docId) {
      return doc;
    }

    if (doc.children && Array.isArray(doc.children)) {
      for (let i = 0; i < doc.children.length; i++) {
        const result = findDocById(doc.children[i], docId);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  if (deleteConfig.type === FOLDER) {
    const root = docs![0];
    const doc = findDocById(root, deleteConfig.docId!);
    if (!doc) {
      return null;
    }

    if (doc._id.toString() === deleteConfig.docId) {
      if (doc.childrenIds.length > 0) {
        return (
          <DialogModal
            icon={
              <ExclamationTriangleIcon
                className="h-10 w-10 text-orange-600"
                aria-hidden="true"
              />
            }
            title={`Cannot delete folder`}
            body={'The folder should be empty.'}
            show={true}
            onClose={'/dashboard/docs'}
            goToButtons={[
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => deleteDoc(false)}
              >
                Go Back
              </button>,
            ]}
          />
        );
      } else {
        return (
          <DialogModal
            icon={
              <ExclamationTriangleIcon
                className="h-10 w-10 text-orange-600"
                aria-hidden="true"
              />
            }
            title={`Delete folder`}
            body={'Are you sure? This cannot be undone.'}
            show={true}
            onClose={'/dashboard/docs'}
            goToButtons={[
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => deleteDoc(false)}
              >
                Cancel
              </button>,
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => deleteDoc(true)}
              >
                Confirm
              </button>,
            ]}
          />
        );
      }
    }
  }

  if (deleteConfig.type === FILE) {
    return (
      <DialogModal
        icon={
          <ExclamationTriangleIcon
            className="h-10 w-10 text-orange-600"
            aria-hidden="true"
          />
        }
        title={`Delete file`}
        body={'Are you sure? This cannot be undone.'}
        show={true}
        onClose={'/dashboard/docs'}
        goToButtons={[
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => deleteDoc(false)}
          >
            Cancel
          </button>,
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => deleteDoc(true)}
          >
            Confirm
          </button>,
        ]}
      />
    );
  }

  async function deleteDoc(isDelete: boolean) {
    if (!isDelete) {
      return setDeleteConfig({});
    }

    try {
      const response = await fetch(
        `/api/doc?companyId=${deleteConfig.companyId}&docId=${deleteConfig.docId}&type=${deleteConfig.type}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error',
          message: 'Failed to delete document',
          type: 'error',
        });
      }

      toast({
        title: 'Success',
        message: 'Document deleted',
        type: 'success',
      });

      const data = await response.json();
      if (data) {
        fetchDocs(userValue.user.companyId as string);
      }

      const res = await fetch(
        `/api/notify?companyId=${userValue.user.companyId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            title: `${userValue.user.name} deleted a file`,
            description: `${userValue.user.name} deleted the file ${data.name} from ${data.parentPath}`,
            recipientId: null,
            dateTime: `${new Date().toISOString().split('.')[0]}Z`,
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
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to delete document',
        type: 'error',
      });
    } finally {
      setDeleteConfig({});
    }
  }

  async function fetchDocs(companyId: string) {
    if (!companyId) {
      return;
    }

    try {
      const response = await fetch(`/api/doc?companyId=${companyId}`);
      if (!response.ok) {
        toast({
          title: 'Error',
          message: 'Failed to fetch documents',
          type: 'error',
        });
      }
      const data = await response.json();
      setDocs(data);
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to fetch documents',
        type: 'error',
      });
    }
  }

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
      const result = await fetch(
        `/api/read?companyId=${userValue.user.companyId as string}`,
        {
          method: 'POST',
          body: JSON.stringify(context),
        },
      );

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
      }
    } catch (err) {
      toast({
        title: 'Error',
        message: 'Error sending query. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSelectDocument = (url: string, name: string) => {
    setSelectedDocument(url);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${prevMessages.length + 1}`,
        content: `Auto Cortext: Perfect. Ask me about the file ${name}`,
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
            <div className="flex justify-end items-center py-1 border-b">
              <Search />
            </div>
            <div className="flex flex-col">
              <div className="pt-2 overflow-scroll">
                <DocStructure
                  selectDoc={handleSelectDocument}
                  docs={docs}
                  fetchDocs={fetchDocs}
                  onDeleteDoc={setDeleteConfig}
                />
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
                <AiPromptChat
                  callback={sendQuery}
                  isLoading={loading}
                  isVerbose={false}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
