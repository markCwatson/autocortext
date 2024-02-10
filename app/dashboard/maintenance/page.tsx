'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { useUserContext } from '@/components/UserProvider';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { JobsModel } from '@/repos/JobsRepository';

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
      console.error('Error fetching jobs:', error);
    }
  }

  useEffect(() => {
    fetchJobs(userValue.user.companyId as string);
  }, []);

  useEffect(() => {}, [jobs]);

  if (!jobs) {
    return (
      <div className="flex flex-col gap-4 w-full h-full justify-center items-center">
        <ArrowPathIcon
          className="h-6 w-6 text-green-600 animate-spin"
          aria-hidden="true"
        />
        Loading jobs...
      </div>
    );
  }

  return (
    <>
      <KanbanBoard jobs={jobs} fetchJobs={fetchJobs} />
    </>
  );
}
