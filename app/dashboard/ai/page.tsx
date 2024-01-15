'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AnimatedText from '@/components/AnimatedText';
import AiPrompt from '@/components/AiPrompt';
import {
  ArrowDownOnSquareIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/20/solid';
import { toast } from '@/components/Toast';
import DropdownButton from '@/components/DropdownButton';
import MyDocument from '@/components/MyDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, buttonVariants } from '@/components/Button';

export default function Ai() {
  const [answer, setAnswer] = useState('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    if (session.data?.user.name) {
      setAnswer(
        `Hello ${session.data.user.name}. I am ready to assist you. Let me know if you need anything.`,
      );
    }
  }, [session]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const answer = sessionStorage.getItem('answer');
      if (answer) {
        setAnswer(answer);
      }
    };

    window.addEventListener('storageUpdate', handleStorageUpdate);

    return () => {
      window.removeEventListener('storageUpdate', handleStorageUpdate);
    };
  }, []);

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
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          margin: 8,
        }}
      >
        <DropdownButton
          title="AI Model: gpt-3.5-turbo-instruct"
          listItems={[
            'gpt-3.5-turbo-instruct',
            'gpt-3.5-turbo-1106',
            'gpt-4-1106-preview',
          ]}
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
                document={<MyDocument report={answer} />}
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
      <div
        style={{
          display: 'flex',
          textAlign: 'left',
          border: '1px solid white',
          margin: 4,
          padding: 50,
        }}
      >
        <AnimatedText
          text={answer}
          show={true}
          animated={true}
          animationDelay={500}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          margin: 8,
        }}
      >
        <AiPrompt />
      </div>
    </>
  );
}
