import { Button } from '@/components/Button';
import { useQueryContext } from '@/components/AiMessagesProvider';
import { Loader2 } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface AiPromptSimpleProps {
  isLoading: boolean;
  callback: MouseEventHandler<HTMLButtonElement>;
}

export default function AiPromptSimple({
  isLoading,
  callback,
}: AiPromptSimpleProps) {
  const { messages, setMessages } = useQueryContext();

  return (
    <>
      <input
        className="mt-3 rounded border w-[400px] text-black px-2 py-1"
        onChange={(e) =>
          setMessages([
            ...messages,
            {
              id: String(messages.length + 1),
              content: `User: ${e.target.value}`,
              role: 'user',
            },
          ])
        }
        placeholder="Enter query here..."
      />
      <Button className="w-[400px] mt-3" onClick={callback}>
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        ) : (
          'Ask CortexT'
        )}
      </Button>
    </>
  );
}
