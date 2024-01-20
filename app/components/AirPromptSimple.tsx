import { Button } from '@/components/Button';
import { useQueryContext } from '@/components/AiQueryProvider';
import { Loader2 } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface AiPromptSimpleProps {
  callback: MouseEventHandler<HTMLButtonElement>;
}

export default function AiPromptSimple({ callback }: AiPromptSimpleProps) {
  const { interaction, setInteraction } = useQueryContext();

  return (
    <>
      <input
        className="mt-3 rounded border w-[400px] text-black px-2 py-1"
        onChange={(e) =>
          setInteraction({ ...interaction, question: e.target.value })
        }
        placeholder="Enter query here..."
      />
      <Button className="w-[400px] mt-3" onClick={callback}>
        {interaction.loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        ) : (
          'Ask AscendAI'
        )}
      </Button>
    </>
  );
}
