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
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
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
          <button
            type="button"
            className={`p-3 ${isCopied ? 'animate-grow-shrink' : null}`}
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
              document={<MyDocument report={report} />}
              fileName="coretext-report.pdf"
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
