import React from 'react';

type Props = {};

export default function Preview({}: Props) {
  return (
    <div className="flex items-center justify-center bg-my-color5 py-1">
      <p className="text-sm leading-6 text-white">
        <a href="#">
          <strong className="font-semibold">
            This is a preview version of AscendAI
          </strong>
        </a>
      </p>
    </div>
  );
}
