import { Button } from '@/components/Button';
import { useQueryContext } from '@/components/AiQueryProvider';
import { ChartPieIcon } from '@heroicons/react/20/solid';
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
        Ask AscendAI
      </Button>
      {interaction.loading && (
        <ChartPieIcon className="my-5 w-8 h-8 animate-spin" />
      )}
    </>
  );
}
