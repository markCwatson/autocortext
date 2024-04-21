'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AiHeader from '@/components/AiHeader';
import { toast } from '@/components/Toast';
import { useQueryContext } from '@/providers/AiMessagesProvider';
import { AiMessageList } from '@/components/AiMessageList';
import AiPromptChat from '@/components/AiPromptChat';
import OptionSelector from '@/components/OptionSelector';
import { machines } from '@/lib/machines';
import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { HistoryModel } from '@/repos/HistoryRepository';
import DialogModal from '@/components/DialogModal';
import Summary from '@/components/Summary';
import { Button } from '@/components/Button';
import classNames from '@/lib/classNames';
import { AiMessage } from '@/types';
import LogoBrainSvg from '@/components/LogoBrainSvg';
import { mainContainerStyle } from '@/lib/mainContainerStyle';
import { Loader2 } from 'lucide-react';
import { Switch } from '@headlessui/react';

// todo: a lot of duplicate code here with docs page. refactor into a component

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

interface ButtonProps {
  title: string;
  icon:
    | React.ForwardRefExoticComponent<any>
    | React.FC<React.SVGProps<SVGSVGElement>>;
  handler: () => void;
}

interface issueOptionsProps {
  title: string;
  options: string[];
  handler: (selected: string) => void;
}

export default function Troubleshoot() {
  const session = useSession();
  const { messages, setMessages } = useQueryContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryModel[] | null>(null);
  const [machine, setMachine] = useState('None Selected');
  const [issueType, setIssueType] = useState('None Selected');
  const [companyId, setCompanyId] = useState('');
  const [animate, setAnimate] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<
    number | null
  >(null);
  const [savedPrompt, setSavedPrompt] = useState<{
    messages: AiMessage[];
  } | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState('');
  const [newTitle, setNewTitle] = useState({
    id: '',
    title: '',
  });
  const [newChat, setNewChat] = useState(false);
  const [busyButtonIndex, setBusyButtonIndex] = useState(-1);
  const [isVerbose, setIsVerbose] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (isEditingTitle === id) {
      setNewTitle({ ...newTitle, title: e.target.value });
    }
  };

  const buttons: ButtonProps[] = [
    {
      title: 'New Chat',
      icon: ArrowPathIcon,
      handler: () => {
        setMessages([
          {
            id: `1`,
            content: `Auto Cortext: Hello ${session.data!.user.name}.

            Today's date is ${
              new Date().toISOString().split('T')[0]
            }, and the local time is ${new Date().toLocaleTimeString()}.

            What machine are you having trouble with?`,
            role: 'assistant',
          },
        ]);
        setMachine('None Selected');
        setIssueType('None Selected');
        setSelectedHistoryIndex(null);
        setNewChat(!newChat);
      },
    },
    {
      title: 'Create Job',
      icon: ClockIcon,
      handler: createJob,
    },
    {
      title: 'Summarize',
      icon: LogoBrainSvg,
      handler: summarizeMessages,
    },
    {
      title: 'Ellaborate',
      icon: ArrowsPointingOutIcon,
      handler: elaboratePreviousResponse,
    },
    {
      title: 'Simplify',
      icon: QuestionMarkCircleIcon,
      handler: simplifyPreviousResponse,
    },
  ];

  const issueOptions: issueOptionsProps[] = [
    {
      title: 'Select machine:',
      options: machines,
      handler: machineSelectionHandler,
    },
    {
      title: 'Select system:',
      options: issueTypes,
      handler: issueTypeSelectionHandler,
    },
  ];

  useEffect(() => {
    if (session.data?.user.name && messages.length === 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${prevMessages.length + 1}`,
          content: `Auto Cortext: Hello ${session.data.user.name}.

          Today's date is ${
            new Date().toISOString().split('T')[0]
          }, and the local time is ${new Date().toLocaleTimeString()}.

          What machine are you having trouble with? Please select a machine from the side menu.`,
          role: 'assistant',
        },
      ]);

      setCompanyId(session.data.user.companyId as string);
      fetchHistory();
    }
  }, [session]);

  useEffect(() => {}, [isEditingTitle]);

  async function fetchHistory() {
    const companyId = session.data?.user.companyId;
    if (!companyId) return;

    const response = await fetch(`/api/history?companyId=${companyId}`);
    if (!response.ok) {
      toast({
        title: 'Error',
        message: 'Failed to fetch history',
        type: 'error',
      });
      return;
    }

    const data = await response.json();
    setHistory(data);
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
    setIssueType(selectedIssueType);

    let nextMessage: string;
    if (machine === 'None Selected') {
      nextMessage = `Auto Cortext: You need to select a machine so I can help you with the ${selectedIssueType} system.`;
    } else {
      nextMessage = `Auto Cortext: OK, tell me about the problem you are experiencing with the ${selectedIssueType} system in the ${machine}.`;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${prevMessages.length + 1}`,
        content: `${
          session.data!.user.name
        } is having issues with the ${selectedIssueType} system.`,
        role: 'user',
      },
      {
        id: `${prevMessages.length + 2}`,
        content: nextMessage,
        role: 'assistant',
      },
    ]);

    setAnimate(true);
  }

  function machineSelectionHandler(selectedMachine: string) {
    setMachine(selectedMachine);

    let nextMessage: string;
    if (issueType === 'None Selected') {
      nextMessage = `Auto Cortext: Great! What system in the ${selectedMachine} are you having issues with?`;
    } else {
      nextMessage = `Auto Cortext: OK, tell me about the problem you are experiencing with the ${issueType} system in the ${selectedMachine}.`;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${prevMessages.length + 1}`,
        content: `${session.data!.user.name} selected the ${selectedMachine}`,
        role: 'user',
      },
      {
        id: `${prevMessages.length + 2}`,
        content: nextMessage,
        role: 'assistant',
      },
    ]);

    setAnimate(true);
  }

  async function sendQuery(event: any, newMessage: AiMessage) {
    event.preventDefault();
    if (!messages) return;
    if (!session.data) return;

    toast({
      title: 'Please wait...',
      message: 'Your query is being processed.',
      type: 'info',
      duration: 3000,
    });

    const context = [...messages, newMessage]
      .map((message) => message.content)
      .join('\n');

    setIsLoading(true);
    setAnimate(true);

    try {
      const response = await fetch(
        `/api/read?companyId=${session.data.user.companyId as string}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(context),
        },
      );

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
    setSelectedHistoryIndex(index);

    if (selectedHistoryMessages) {
      setMessages(selectedHistoryMessages.messages);
      setAnimate(false);

      if (!savedPrompt) {
        setSavedPrompt({
          messages: messages,
        });
      }
    }
  }

  function restorePrompt() {
    if (!savedPrompt) return;

    setSelectedHistoryIndex(null);
    setMessages(savedPrompt.messages);
    setAnimate(false);

    setSavedPrompt(null);
  }

  async function summarizeMessages() {
    if (messages.length === 0) {
      toast({
        title: 'Error',
        message: 'No messages to summarize.',
        type: 'error',
      });
      return;
    }

    buttons.map((b, index) => {
      if (b.title === 'Summarize') {
        setBusyButtonIndex(index);
      }
    });

    toast({
      title: 'Please wait...',
      message: 'Summary is being generated.',
      type: 'info',
    });

    const res = await fetch('/api/openai/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation: messages.map((m) => m.content) }),
    });

    if (res.ok) {
      const { summary } = await res.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `${prevMessages.length + 1}`,
          content: `Auto Cortext: Summary: ${summary}`,
          role: 'assistant',
        },
      ]);

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

    setBusyButtonIndex(-1);
  }

  async function elaboratePreviousResponse() {
    if (messages.length === 0) {
      toast({
        title: 'Error',
        message: 'No messages to elaborate.',
        type: 'error',
      });
      return;
    }

    buttons.map((b, index) => {
      if (b.title === 'Ellaborate') {
        setBusyButtonIndex(index);
      }
    });

    // Do not add this message ot the messages list to ensure it is not saved in history
    const newMessage: AiMessage = {
      id: String(messages.length + 1),
      content: `User: Can you elaborate on that? Be as detailed as possible. Do not use markdown format (plain text only, but a numbered list is ok).`,
      role: 'user',
    };

    await sendQuery(new MouseEvent('click'), newMessage);
    setBusyButtonIndex(-1);
  }

  async function simplifyPreviousResponse() {
    if (messages.length === 0) {
      toast({
        title: 'Error',
        message: 'No messages to simplify.',
        type: 'error',
      });
      return;
    }

    buttons.map((b, index) => {
      if (b.title === 'Simplify') {
        setBusyButtonIndex(index);
      }
    });

    // Do not add this message ot the messages list to ensure it is not saved in history
    const newMessage: AiMessage = {
      id: String(messages.length + 1),
      content: `User: Can you simplify that last response for me? Keep the response to only a few sentences and use simply words. Do not use markdown format (plain text only, but a numbered list is ok).`,
      role: 'user',
    };

    await sendQuery(new MouseEvent('click'), newMessage);
    setBusyButtonIndex(-1);
  }

  async function handleSave({ summarize }: { summarize: boolean }) {
    setShowModal(false);

    if (summarize) {
      toast({
        title: 'Please wait...',
        message: 'The conversation is being summarized then saved.',
        type: 'info',
      });
    }

    const res = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        machine,
        messages,
        companyId,
        summarize,
      }),
    });

    if (!res.ok) {
      toast({
        title: 'Failed to save report!',
        message: 'Please try again.',
        type: 'error',
      });
      return;
    }

    setMessages([
      {
        id: `1`,
        content: `Auto Cortext: Hello ${session.data!.user.name}.

        Today's date is ${
          new Date().toISOString().split('T')[0]
        }, and the local time is ${new Date().toLocaleTimeString()}.

        What machine are you having trouble with?`,
        role: 'assistant',
      },
    ]);

    toast({
      title: 'Report saved!',
      message: 'The report was saved successfully.',
      type: 'success',
    });

    fetchHistory();
  }

  async function updateTitle(id: string) {
    setIsEditingTitle('');
    if (newTitle.title === '') return;
    if (id === '') return;

    const response = await fetch(`/api/history?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle.title }),
    });

    if (!response.ok) {
      toast({
        title: 'Error',
        message: 'Error updating title',
        type: 'error',
      });
      return;
    }

    fetchHistory();
  }

  async function createJob() {
    buttons.map((b, index) => {
      if (b.title === 'Create Job') {
        setBusyButtonIndex(index);
      }
    });

    toast({
      title: 'Please wait...',
      message: 'Job is being created.',
      type: 'info',
    });

    let res = await fetch('/api/job/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: messages.map((m) => m.content),
        meta: {
          name: session.data?.user.name!,
          img: session.data?.user.image || '',
          creatorId: session.data?.user.id!,
          companyId: session.data?.user.companyId as string,
          machine: machine,
        },
      }),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error creating job',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    toast({
      title: 'Success',
      message: 'Job created',
      type: 'success',
      duration: 2000,
    });

    handleSave({ summarize: false });
    setBusyButtonIndex(-1);
    router.push('/dashboard/jobs');
  }

  if (showModal) {
    return (
      <DialogModal
        icon={
          <LogoBrainSvg
            className="h-10 w-10 text-my-color10 animate-pulse"
            aria-hidden="true"
          />
        }
        title={'Do you want to add a summary?'}
        body={
          'If you want, Auto Cortext can add a summary of this conversation to this record. This is convenient when reviewing past conversations.'
        }
        show={true}
        onClose={'/dashboard/troubleshoot'}
        goToButtons={[
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleSave({ summarize: false })}
          >
            Skip for now
          </button>,
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleSave({ summarize: true })}
          >
            Summarize
          </button>,
        ]}
      />
    );
  }

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
      <div
        className="grid pt-2 grid-cols-1 lg:grid-cols-12 gap-x-4 gap-y-10 "
        style={columnStyle}
      >
        {/* Left empty div */}
        <div className="bg-transparent lg:visible lg:col-span-1" />
        {/** History */}
        <div className="lg:col-span-4 bg-my-color7 border rounded overflow-visible">
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
                    key={index}
                    className={`flex justify-between items-center px-4 hover:bg-my-color5 hover:rounded pl-4 ${
                      selectedHistoryIndex === index ? 'bg-my-color5' : ''
                    }`}
                  >
                    <div className="flex justify-start items-center gap-2">
                      <Summary messages={item.messages} />
                      <button
                        onClick={(e) => hanldeSelectHistory(e, index)}
                        className="text-left"
                      >
                        <div className="text-left">
                          {isEditingTitle === item._id.toString() ? (
                            <input
                              type="text"
                              className="bg-my-color1 text-my-color10 broder"
                              value={newTitle.title}
                              onChange={(e) =>
                                handleChange(e, item._id.toString())
                              }
                              onBlur={() => setIsEditingTitle('')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateTitle(item._id.toString());
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <p className="text-left">{item.title}</p>
                          )}
                        </div>
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <EllipsisHorizontalIcon
                        className={`w-4 h-4 cursor-pointer hover:opacity-100 mr-2 ${
                          selectedHistoryIndex === index
                            ? 'opacity-100'
                            : 'opacity-25'
                        }`}
                        onClick={() => {
                          setIsEditingTitle(item._id.toString());
                          setNewTitle({
                            id: item._id.toString(),
                            title: item.title,
                          });
                        }}
                      />
                      <TrashIcon
                        className={`w-4 h-4 cursor-pointer hover:opacity-100 ${
                          selectedHistoryIndex === index
                            ? 'opacity-100'
                            : 'opacity-5'
                        }`}
                        onClick={() => deleteHistoryItem(item._id.toString())}
                      />
                    </div>
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
        <div className="lg:col-span-5 pb-8 bg-my-color7 border rounded overflow-hidden">
          <AiHeader
            messages={messages}
            machine={machine}
            companyId={companyId}
            onSave={() => setShowModal(true)}
          />
          <div className="flex flex-col justify-center w-full h-full">
            <AiMessageList
              messages={messages}
              animate={!selectedHistoryIndex && animate}
              animationTextDelay={12}
            />
            {machine !== 'None Selected' &&
              issueType !== 'None Selected' &&
              !selectedHistoryIndex && (
                <div className="w-full px-4">
                  <AiPromptChat
                    callback={sendQuery}
                    isLoading={isLoading}
                    isVerbose={isVerbose}
                  />
                </div>
              )}
          </div>
        </div>
        {/* Buttons */}
        <div className="bg-transparent lg:visible lg:col-span-2">
          <div className="w-full h-full pt-14">
            <ul role="list" className="space-y-2 mx-4">
              {buttons.map((b, index) => (
                <li key={`${b.title}-${index}`}>
                  <Button
                    size={'lg'}
                    onClick={b.handler}
                    className={classNames(
                      'text-my-color1 hover:bg-my-color4',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                      'w-full px-10 justify-start',
                    )}
                  >
                    {busyButtonIndex !== index ? (
                      <>
                        <b.icon
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {b.title}
                      </>
                    ) : (
                      <div className="flex items-center gap-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        <p>Processing...</p>
                      </div>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-10 w-full flex justify-center">
              <Switch.Group as="div" className="flex items-center">
                <Switch
                  checked={isVerbose}
                  onChange={setIsVerbose}
                  className={classNames(
                    isVerbose ? 'bg-indigo-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isVerbose ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    )}
                  />
                </Switch>
                <Switch.Label as="span" className="ml-3 text-sm">
                  <span className="font-medium text-my-color1">
                    {isVerbose ? 'Verbose mode' : 'Concise mode'}
                  </span>
                </Switch.Label>
              </Switch.Group>
            </div>
            <div className="mt-10">
              <ul role="list" className="space-y-2 mx-4">
                {issueOptions.map((o, index) => (
                  <li key={`${o.title}-${index}`}>
                    <div className="w-full">
                      <OptionSelector
                        title={o.title}
                        options={
                          selectedHistoryIndex ? ['From history'] : o.options
                        }
                        handler={selectedHistoryIndex ? () => null : o.handler}
                        trigger={newChat}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
