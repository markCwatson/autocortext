'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { useUserContext } from '@/providers/UserProvider';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { JobsModel } from '@/repos/JobsRepository';
import { toast } from '@/components/Toast';
import { mainContainerStyle } from '@/lib/mainContainerStyle';

export default function TroubleShooting() {
  const userValue = useUserContext();
  const [jobs, setJobs] = useState<JobsModel[] | null>(null);

  async function fetchJobs(companyId: string) {
    if (!companyId) {
      return;
    }

    try {
      const response = await fetch(`/api/job?companyId=${companyId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to fetch jobs',
        type: 'error',
      });
    }
  }

  useEffect(() => {
    fetchJobs(userValue.user.companyId as string);
  }, []);

  useEffect(() => {}, [jobs]);

  if (!jobs) {
    return (
      <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
        <div className="flex flex-col gap-4 w-full h-full justify-center items-center">
          <ArrowPathIcon
            className="h-6 w-6 text-green-600 animate-spin"
            aria-hidden="true"
          />
          Loading jobs...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
      <div className="h-full w-full">
        <KanbanBoard jobs={jobs} fetchJobs={fetchJobs} />
      </div>
    </main>
  );
}
