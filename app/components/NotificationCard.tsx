import { Notification } from '@/types';

interface NotificationCardProps extends Notification {
  onClick: () => void;
}

export default function NotificationCard(props: NotificationCardProps) {
  return (
    <div className="bg-white rounded-lg border shadow-md m-1">
      <div className="px-2 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-left text-sm font-semibold leading-6 text-my-color10">
              {props.title}
            </h3>
            <div className="text-left mt-2 max-w-xl text-xs text-my-color9">
              <p>{props.description}</p>
            </div>
          </div>
          <div className="ml-4 mt-0 flex flex-shrink-0 items-center justify-center">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={props.onClick}
            >
              {'Clear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
