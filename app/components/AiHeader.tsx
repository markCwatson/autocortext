'use client';

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  ArrowDownOnSquareIcon,
  ClipboardDocumentCheckIcon,
  InboxArrowDownIcon,
} from '@heroicons/react/20/solid';
import MyDocument from '@/components/MyDocument';
import { toast } from '@/components/Toast';
import DialogModal from '@/components/DialogModal';
import LogoBrainSvg from '@/components/LogoBrainSvg';
import { isClientCtx } from '@/providers/ClientCtxProvider';
import { Button } from '@/components/Button';
import { AiMessage } from '@/types';
import { SchoolIcon } from 'lucide-react';

interface AiHeaderProps {
  messages: AiMessage[];
  machine?: string;
  companyId?: string;
  onSave?: ({ summarize }: { summarize: boolean }) => void;
  onTrain?: () => void;
}

export default function AiHeader({
  messages,
  machine,
  companyId,
  onSave,
  onTrain,
}: AiHeaderProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [report, setReport] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);

  const isClient = isClientCtx();

  const copyToClipboard = () => {
    const report = messages.map((message) => message.content).join('\n');
    setReport(report);
    navigator.clipboard.writeText(report).then(
      () => {
        // Trigger the animation by resetting isCopied
        setIsCopied(false);
        setTimeout(() => setIsCopied(true), 10);

        return toast({
          title: 'Copied text.',
          message: 'You can now paste it.',
          type: 'success',
        });
      },
      (err) => {
        setIsCopied(false);
        return toast({
          title: 'Failed to copy text.',
          message: 'Please try again.',
          type: 'error',
        });
      },
    );
  };

  if (showSaveModal && onSave) {
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
          'If you want, AutoCortext can add a summary of this conversation to this record. This is convenient when reviewing past conversations.'
        }
        show={true}
        onClose={'/dashboard/troubleshoot'}
        goToButtons={[
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              setShowSaveModal(false);
              onSave({ summarize: false });
            }}
          >
            Skip for now
          </button>,
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              setShowSaveModal(false);
              onSave({ summarize: true });
            }}
          >
            Summarize
          </button>,
        ]}
      />
    );
  }

  if (showTrainModal && onTrain) {
    return (
      <DialogModal
        icon={
          <LogoBrainSvg
            className="h-10 w-10 text-my-color10 animate-pulse"
            aria-hidden="true"
          />
        }
        title={'Do you want to train AutoCortext?'}
        body={
          'This action will train AutoCortext on the current conversation. The data will be private to your company. Are you sure you want to continue?'
        }
        show={true}
        onClose={'/dashboard/troubleshoot'}
        goToButtons={[
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setShowTrainModal(false)}
          >
            Cancel
          </button>,
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              setShowTrainModal(false);
              onTrain();
            }}
          >
            Continue
          </button>,
        ]}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2 md:gap-4">
          {onSave && (
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => setShowSaveModal(true)}
            >
              <InboxArrowDownIcon className="h-6 w-6 mr-2" aria-hidden="true" />
              Save
            </Button>
          )}
          {onTrain && (
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => setShowTrainModal(true)}
            >
              <SchoolIcon className="h-6 w-6 mr-2" aria-hidden="true" />
              Train
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            className={`p-0 ${isCopied ? 'animate-grow-shrink' : null}`}
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy to clipboard</span>
            <ClipboardDocumentCheckIcon
              className="h-6 w-6"
              aria-hidden="true"
            />
          </button>
          <div>
            {isClient && (
              <PDFDownloadLink
                document={<MyDocument messages={messages} />}
                fileName="auto-cortext-report.pdf"
              >
                <ArrowDownOnSquareIcon
                  className="h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
