'use client';

import React, { CSSProperties, use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AiHeader from '@/components/AiHeader';
import { toast } from '@/components/Toast';
import { AiMessage, useQueryContext } from '@/providers/AiMessagesProvider';
import { AiMessageList } from '@/components/AiMessageList';
import AiPromptChat from '@/components/AiPromptChat';
import OptionSelector from '@/components/OptionSelector';
import { machines } from '@/lib/machines';
import {
  ArrowPathIcon,
  CubeTransparentIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { HistoryModel } from '@/repos/HistoryRepository';
import DialogModal from '@/components/DialogModal';
import Summary from '@/components/Summary';

// todo: a lot of duplicate code here with docs page. refactor into a component

const navBarHeight = '170px';

const mainContainerStyle: CSSProperties = {
  height: `calc(100vh - ${navBarHeight})`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const columnStyle: CSSProperties = {
  height: '100%',
};

const issueTypes = [
  'None Selected',
  'Electrical',
  'Mechanical',
  'Hydraulic',
  'Pneumatic',
  'Software',
  'Hardware',
  'Other',
  'Unknown',
];

export default function Reports() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryModel[] | null>(null);

  const [isMachineSelected, setIsMachineSelected] = useState(false);
  const [isIssueTypeSelected, setIsIssueTypeSelected] = useState(false);

  const [machine, setMachine] = useState('None Selected');
  const [companyId, setCompanyId] = useState('');
  const [animate, setAnimate] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null,
  );
  const [savedPrompt, setSavedPrompt] = useState<{
    isMachineSelected: boolean;
    isIssueTypeSelected: boolean;
    displyMachine: boolean;
    displayIssueType: boolean;
    messages: AiMessage[];
  } | null>(null);

  const [displayMachineOptions, setDisplayMachineOptions] = useState(false);
  const [displayIssueTypeOptions, setDisplayIssueTypeOptions] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const { messages, setMessages } = useQueryContext();

  useEffect(() => {
    if (session.data?.user.name && messages.length === 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${prevMessages.length + 1}`,
          content: `Auto Cortext: Hello ${session.data.user.name}.

        I am ready to assist you in troubleshooting problems with your equipment. If you explain the issue, I will suggest a solution.

        What machine are you having trouble with?`,
          role: 'assistant',
        },
      ]);

      setCompanyId(session.data.user.companyId as string);
      fetchHistory();
    }
  }, [session]);

  useEffect(() => {
    setTimeout(() => {
      setDisplayMachineOptions(true);
    }, 0);
  }, []);

  useEffect(() => {}, [history]);

  useEffect(() => {
    setTimeout(() => {
      if (isMachineSelected) setDisplayIssueTypeOptions(true);
    }, 0);
  }, [isMachineSelected]);

  async function fetchHistory() {
    const companyId = session.data?.user.companyId;
    if (!companyId) return;

    const response = await fetch(`/api/history?companyId=${companyId}`);
    if (response.ok) {
      const data = await response.json();
      setHistory(data);
    }

    return;
  }

  async function deleteHistoryItem(_id: string) {
    const companyId = session.data?.user.companyId;
    if (!companyId) return;

    const response = await fetch(`/api/history`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id, companyId }),
    });

    if (response.ok) {
      const deletedHistoryItem = await response.json();
      setHistory((prevHistory) => {
        if (!prevHistory) return prevHistory;
        return prevHistory.filter(
          (item) => item._id !== deletedHistoryItem._id,
        );
      });

      toast({
        title: 'Success',
        message: 'History item deleted',
        type: 'success',
      });
    } else {
      toast({
        title: 'Error',
        message: 'Error deleting history item',
        type: 'error',
      });
    }

    return;
  }

  function issueTypeSelectionHandler(selectedIssueType: string) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${prevMessages.length + 1}`,
        content: `${
          session.data!.user.name
        } selected the ${selectedIssueType} system.`,
        role: 'user',
      },
      {
        id: `${prevMessages.length + 2}`,
        content: `Auto Cortext: OK, tell me about the problem you are experiencing with the ${selectedIssueType} system`,
        role: 'assistant',
      },
    ]);

    setDisplayIssueTypeOptions(false);
    setIsIssueTypeSelected(true);
  }

  function machineSelectionHandler(selectedMachine: string) {
    setMachine(selectedMachine);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${prevMessages.length + 1}`,
        content: `${session.data!.user.name} selected the ${selectedMachine}`,
        role: 'user',
      },
      {
        id: `${prevMessages.length + 2}`,
        content: `Auto Cortext: Great! What system in the ${selectedMachine} are you having issues with?`,
        role: 'assistant',
      },
    ]);

    setDisplayMachineOptions(false);
    setIsMachineSelected(true);
  }

  async function sendQuery(event: any, newMessage: AiMessage) {
    event.preventDefault();
    if (!messages) return;
    const context = [...messages, newMessage]
      .map((message) => message.content)
      .join('\n');

    setIsLoading(true);

    toast({
      title: 'Success',
      message: `Sending query...`,
      duration: 2000,
    });

    try {
      const response = await fetch('/api/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      });

      if (!response?.ok) {
        return toast({
          title: 'Error',
          message: `Server status code: ${response.status}`,
          type: 'error',
        });
      }

      const json = await response.json();
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
      setIsLoading(false);
    }
  }

  function hanldeSelectHistory(
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) {
    e.preventDefault();
    if (!history) return;

    const selectedHistoryMessages = history[index];
    setSelectedFileIndex(index);

    if (selectedHistoryMessages) {
      setMessages(selectedHistoryMessages.messages);

      if (!savedPrompt) {
        setSavedPrompt({
          isMachineSelected: isMachineSelected,
          isIssueTypeSelected: isIssueTypeSelected,
          displyMachine: displayMachineOptions,
          displayIssueType: displayIssueTypeOptions,
          messages: messages,
        });

        setDisplayIssueTypeOptions(false);
        setDisplayMachineOptions(false);
        setIsIssueTypeSelected(false);
        setIsMachineSelected(false);
      }
    }
  }

  function restorePrompt() {
    if (!savedPrompt) return;

    setSelectedFileIndex(null);
    setMessages(savedPrompt.messages);
    setDisplayMachineOptions(savedPrompt.displyMachine);
    setDisplayIssueTypeOptions(savedPrompt.displayIssueType);
    setIsIssueTypeSelected(savedPrompt.isIssueTypeSelected);
    setIsMachineSelected(savedPrompt.isMachineSelected);

    setSavedPrompt(null);
  }

  async function handleSummarize(summarize: boolean) {
    setShowModal(false);
    let messagesCopy = messages;

    if (summarize) {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation: messages.map((m) => m.content) }),
      });

      if (res.ok) {
        const { summary } = await res.json();

        messagesCopy.push({
          id: `${messagesCopy.length + 1}`,
          content: `Auto Cortext: Summary: ${summary}`,
          role: 'assistant',
        });

        toast({
          title: 'Success',
          message: 'Summary generated.',
          type: 'success',
        });
      } else {
        toast({
          title: 'Failed to generate summary.',
          message: 'Please try again.',
          type: 'error',
        });
      }
    }

    const res = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        machine,
        messages: messagesCopy,
        companyId,
      }),
    });

    if (res.ok) {
      toast({
        title: 'Success',
        message: 'Report saved.',
        type: 'success',
      });
    } else {
      toast({
        title: 'Failed to save report.',
        message: 'Please try again.',
        type: 'error',
      });
    }

    fetchHistory();

    setMessages([
      {
        id: `1`,
        content: `Auto Cortext: Hello ${session.data!.user.name}.

      I am ready to assist you in troubleshooting problems with your equipment. If you explain the issue, I will suggest a solution.

      What machine are you having trouble with?`,
        role: 'assistant',
      },
    ]);

    setDisplayMachineOptions(true);
    setDisplayIssueTypeOptions(false);
    setIsIssueTypeSelected(false);
    setIsMachineSelected(false);
  }

  if (showModal) {
    return (
      <DialogModal
        icon={
          <CubeTransparentIcon
            className="h-10 w-10 text-my-color10"
            aria-hidden="true"
          />
        }
        title={'Do you want to add a summary?'}
        body={'You can add a summary of this conversation to this record.'}
        show={true}
        onClose={'/dashboard/troubleshoot'}
        goToButtons={[
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleSummarize(false)}
          >
            Skip for now
          </button>,
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleSummarize(true)}
          >
            Summarize
          </button>,
        ]}
      />
    );
  }

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 " style={mainContainerStyle}>
      <div
        className="grid pt-2 grid-cols-1 lg:grid-cols-11 gap-x-4 gap-y-10 "
        style={columnStyle}
      >
        {/* Left empty div */}
        <div className="bg-transparent lg:visible lg:col-span-2" />
        {/** History */}
        <div className="lg:col-span-3 bg-my-color7 border rounded overflow-visible">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              padding: 13,
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <h2 className="text-lg font-semibold text-left">{`History ${
              history ? `(${history.length})` : ''
            }`}</h2>
            <button onClick={restorePrompt} className="border-b-2">
              <div className="text-left">
                <p className="text-left">Clear Selection</p>
              </div>
            </button>
          </div>
          {/* todo: overflow-visible required here to allow summary popover.
              This causes history list to grow. Consider doing something else. */}
          <div className="flex flex-col gap-2 w-full h-full overflow-visible pt-4">
            {history ? (
              history.map((item, index) => {
                return (
                  <div
                    className={`flex justify-between items-center px-4 hover:bg-my-color5 hover:rounded pl-4 ${
                      selectedFileIndex === index ? 'bg-my-color5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 ">
                      <Summary messages={item.messages} />
                      <button
                        onClick={(e) => hanldeSelectHistory(e, index)}
                        className="text-left"
                      >
                        <div key={index} className="text-left">
                          <p className="text-left">{item.title}</p>
                        </div>
                      </button>
                    </div>
                    <TrashIcon
                      className={`w-4 h-4 cursor-pointer hover:opacity-100 ${
                        selectedFileIndex === index
                          ? 'opacity-100'
                          : 'opacity-5'
                      }`}
                      onClick={() => deleteHistoryItem(item._id.toString())}
                    />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col py-24 w-full h-full items-center">
                <ArrowPathIcon
                  className="h-6 w-6 text-green-600 animate-spin"
                  aria-hidden="true"
                />
                Loading history...
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-4 pb-8 bg-my-color7 border rounded overflow-hidden">
          <AiHeader
            messages={messages}
            machine={machine}
            companyId={companyId}
            onSave={() => setShowModal(true)}
          />
          <div className="flex flex-col justify-center w-full h-full">
            <AiMessageList messages={messages} animate={animate} />
            {isMachineSelected && isIssueTypeSelected ? (
              <div className="w-full px-4">
                <AiPromptChat callback={sendQuery} isLoading={isLoading} />
              </div>
            ) : (
              <>
                {displayMachineOptions && (
                  <div className="w-full px-4 fade-in">
                    <div className="ml-6 w-1/2">
                      <OptionSelector
                        title={'Select a machine: '}
                        options={machines}
                        handler={machineSelectionHandler}
                      />
                    </div>
                  </div>
                )}
                {displayIssueTypeOptions && (
                  <div className="w-full px-4 fade-in">
                    <div className="ml-6 w-1/2">
                      <OptionSelector
                        title={'Select an issue type: '}
                        options={issueTypes}
                        handler={issueTypeSelectionHandler}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Right empty div */}
        <div className="bg-transparent hidden lg:visible lg:col-span-2" />
      </div>
    </main>
  );
}
