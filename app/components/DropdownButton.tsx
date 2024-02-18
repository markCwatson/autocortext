'use client';

import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { VariantProps, cva } from 'class-variance-authority';
import classNames from '@/lib/classNames';

const dropdownButtonVariants = cva(
  'inline-flex w-full justify-center gap-x-1.5 px-2 text-sm font-semibold shadow-sm',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg',
      },
      color: {
        default:
          'bg-white rounded-md ring-1 ring-inset ring-gray-300 text-gray-900 hover:bg-gray-50',
        ghost:
          'p-1 bg-transparent text-my-color1 hover:border rounded hover:border-my-color1',
        outline: 'bg-transparent text-gray-900 border border-gray-300',
      },
      chevron: {
        default: 'visible',
        hidden: 'invisible',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'default',
    },
  },
);

interface DropdownButtonProps
  extends VariantProps<typeof dropdownButtonVariants> {
  selection: any;
  listItems: string[];
  handler?: (item: string) => void;
}

export default function DropdownButton({
  selection,
  listItems,
  size,
  color,
  chevron,
  handler,
}: DropdownButtonProps) {
  const [selected, setSelected] = useState(selection);

  const handleSelection = (item: string) => {
    setSelected(item);
    handler?.(item);
  };

  return (
    <Menu as="div" className={'relative inline-block text-left'}>
      <div>
        <Menu.Button className={dropdownButtonVariants({ size, color })}>
          {selected}
          {chevron === 'hidden' ? null : (
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-my-color1"
              aria-hidden="true"
            />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {listItems
              ? listItems.map((item) => (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                        onClick={() => handleSelection(item)}
                      >
                        {item}
                      </a>
                    )}
                  </Menu.Item>
                ))
              : null}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
