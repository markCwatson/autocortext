import { useEffect, useMemo, useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import JobCard from '@/components/JobCard';
import { Column, Id, Job } from '@/types';
import { JobsModel } from '@/repos/JobsRepository';

interface Props {
  column: Column;
  updateJob: (newJob: Job) => void;
  deleteJob: (id: Id) => void;
  jobs: JobsModel[];
}

export default function ColumnContainer({
  column,
  jobs,
  deleteJob,
  updateJob,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [sortedJobs, setSortedJobs] = useState<JobsModel[]>(jobs);

  const jobsIds = useMemo(() => {
    return jobs.map((job) => job.id);
  }, [jobs]);

  useEffect(() => {
    setSortedJobs(jobs.sort((a, b) => parseInt(a.id.toString()) - parseInt(b.id.toString())));
  }, [jobs]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-my-color9 w-[350px] rounded-md flex flex-col"
      style={{ height: 'calc(100vh - 240px)' }} 
    >
      {/* Column title */}
      <div
        onClick={() => {
        }}
        className="bg-my-color9 text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-my-color7 border-2 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-my-color7 px-2 py-1 text-sm rounded-full">
            {jobs?.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-my-color7 focus:border-red-600 border rounded outline-none px-2"
              value={column.title}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Column job container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={jobsIds}>
          {sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              deleteJob={deleteJob}
              updateJob={updateJob}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
