import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function DashboardPage({ children }: Props) {
  return (
    <div className="bg-my-color8 h-full w-full flex justify-center">
      {children}
    </div>
  );
}
