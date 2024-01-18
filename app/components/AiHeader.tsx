'use client';

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  ArrowDownOnSquareIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/20/solid';
import DropdownButton from '@/components/DropdownButton';
import MyDocument from '@/components/MyDocument';
import { Button, buttonVariants } from '@/components/Button';
import { toast } from '@/components/Toast';

interface AiHeaderProps {
  dropDownList: string[];
  report: string;
}

export default function AiHeader({ dropDownList, report }: AiHeaderProps) {
  const [answer, setAnswer] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer).then(
      () => {
        setIsCopied(true);
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
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 8,
      }}
    >
      <DropdownButton
        title="gpt-3.5-turbo-instruct"
        listItems={dropDownList}
        color="ghost"
      />
      <div className="flex items-center">
        <div className="flex items-center gap-2 md:gap-4">
          {isCopied ? (
            <button
              type="button"
              className="p-3 animate-grow-shrink"
              onClick={copyToClipboard}
            >
              <span className="sr-only">Copy to clipboard</span>
              <ClipboardDocumentCheckIcon
                className="h-6 w-6 text-green-500"
                aria-hidden="true"
              />
            </button>
          ) : (
            <button type="button" className="p-3" onClick={copyToClipboard}>
              <span className="sr-only">Copy to clipboard</span>
              <ClipboardDocumentCheckIcon
                className="h-6 w-6 text-my-color10 dark:text-my-color2"
                aria-hidden="true"
              />
            </button>
          )}
          <div>
            <PDFDownloadLink
              document={<MyDocument report={report} />}
              fileName="ascendai-report.pdf"
            >
              <Button className={buttonVariants({ variant: 'outline' })}>
                <ArrowDownOnSquareIcon
                  className="h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
                <p className="pl-4">Download as PDF</p>
              </Button>
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
}
