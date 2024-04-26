import React from 'react';

type Props = {};

export default function Preview({}: Props) {
  return (
    <div className="flex items-center justify-center bg-my-color2 py-1">
      <p className="text-xs leading-6 text-my-color10">
        <a href="#">
          <strong className="font-semibold">This is a demo of </strong>
          <strong className="font-semibold text-my-color6">AUTO </strong>
          <strong className="font-semibold text-red-700">COR</strong>
          <strong className="font-semibold text-my-color6">TEXT </strong>
          <strong className="font-semibold text-my-color10">
            by Ascend AI Solutions
          </strong>
        </a>
      </p>
    </div>
  );
}
