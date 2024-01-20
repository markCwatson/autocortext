import { SearchCheckIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="m-3 flex rounded-md shadow-sm">
      <div className="relative flex flex-grow items-stretch focus-within:z-10">
        <input
          type="text"
          name="text"
          id="text"
          className="block w-full rounded-none rounded-l-md border-0 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search..."
        />
      </div>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-my-color1 ring-1 ring-inset ring-gray-300 bg-my-color9 hover:bg-my-color5"
      >
        <SearchCheckIcon
          className="-ml-0.5 h-5 w-5 text-my-color1"
          aria-hidden="true"
        />
        Search
      </button>
    </div>
  );
}
