import React from 'react';
import { Notification } from '@/types';
import LogoBrainSvg from '@/components/LogoBrainSvg';

interface NotificationCardProps extends Notification {
  onClick: () => void;
}

const NotificationCard = React.forwardRef<
  HTMLDivElement,
  NotificationCardProps
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white rounded-lg border shadow-sm shadow-my-color5 m-2"
    >
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-left text-sm font-semibold leading-6 text-my-color10 border-b">
              {props.title === 'Auto Cortext trained' ? (
                <div className="flex gap-2">
                  <div>
                    <LogoBrainSvg className="w-6 h-6" />
                  </div>
                  <span>{props.title}</span>
                </div>
              ) : (
                <span>{props.title}</span>
              )}
            </h3>
            <div className="text-left mt-2 max-w-xl text-xs text-my-color9">
              <p>{props.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-shrink-0 justify-between">
          <div className="flex clex-col justify-end items-end">
            <time
              dateTime={props.dateTime}
              className="flex-none py-0.5 text-xs leading-5 text-my-color10"
            >
              {`${props.dateTime.split('T')[0]}`}
            </time>
          </div>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 p-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={props.onClick}
          >
            {'Clear'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default NotificationCard;
