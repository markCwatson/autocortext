import { TableColumn } from '@/components/Table';

export const users = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'Admin',
    status: 'Active',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'User',
    status: 'Active',
    date: '3 hours ago',
    dateTime: '2023-01-23T09:00',
  },
  {
    user: {
      name: 'Amanda Jewels',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'User',
    status: 'Expired',
    date: '12 hours ago',
    dateTime: '2023-01-23T00:00',
  },
  {
    user: {
      name: 'Jake Landing',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'Auditor',
    status: 'Active',
    date: '5 days ago',
    dateTime: '2023-01-18T12:34',
  },
  {
    user: {
      name: 'Jesse Watson',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'Auditor',
    status: 'Active',
    date: '1 week ago',
    dateTime: '2023-01-16T15:54',
  },
  {
    user: {
      name: 'David Johnston',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'User',
    status: 'Active',
    date: '1 week ago',
    dateTime: '2023-01-16T11:31',
  },
  {
    user: {
      name: 'Whitney Francis',
      imageUrl:
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    role: 'User',
    status: 'Active',
    date: '2 weeks ago',
    dateTime: '2023-01-09T08:45',
  },
];

export const columns: TableColumn[] = [
  {
    header: 'User',
    accessor: 'user',
    render: (item: any) => (
      <div className="flex items-center gap-x-4">
        <img
          src={item.user.imageUrl}
          alt={item.user.name}
          className="h-8 w-8 rounded-full bg-gray-800"
        />
        <div className="truncate text-sm font-medium leading-6 text-white">
          {item.user.name}
        </div>
      </div>
    ),
  },
  {
    header: 'Role',
    accessor: 'role',
  },
  {
    header: 'License Status',
    accessor: 'status',
    render: (item: any) => {
      const statusColor =
        item.status === 'Active'
          ? 'text-green-400 bg-green-400/10'
          : 'text-rose-400 bg-rose-400/10';

      return (
        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
          <div className={statusColor + ' flex-none rounded-full p-1'}>
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          <div className="hidden text-white sm:block">{item.status}</div>
        </div>
      );
    },
  },
  {
    header: 'Last Online',
    accessor: 'date',
  },
];
