import { useState } from 'react';

interface OptionProps {
  title: string;
  options: string[];
  handler: (option: string) => void;
}

export default function OptionSelector({
  title,
  options,
  handler,
}: OptionProps) {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedOption(event.target.value);
    handler(event.target.value);
  };

  return (
    <>
      <label
        htmlFor="location"
        className="block text-sm font-medium leading-6 text-my-color1"
      >
        {title}
      </label>
      <select
        id="location"
        name="location"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue={selectedOption}
        value={selectedOption}
        onChange={handleSelectionChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}
