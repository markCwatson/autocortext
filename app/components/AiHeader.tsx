'use client';

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  ArrowDownOnSquareIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/20/solid';
import DropdownButton from '@/components/DropdownButton';
import MyDocument from '@/components/MyDocument';
import { toast } from '@/components/Toast';
import { AiMessage } from './AiMessagesProvider';

interface AiHeaderProps {
  dropDownList: string[];
  messages: AiMessage[];
}

export default function AiHeader({ dropDownList, messages }: AiHeaderProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [report, setReport] = useState('');

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
      <DropdownButton
        title={`${dropDownList[0]}`}
        listItems={dropDownList}
        color="ghost"
      />
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
            <PDFDownloadLink
              document={<MyDocument messages={messages} />}
              fileName="auto-cortext-report.pdf"
            >
              <ArrowDownOnSquareIcon
                className="h-6 w-6 shrink-0"
                aria-hidden="true"
              />
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
}
