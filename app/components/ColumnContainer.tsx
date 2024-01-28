import { useMemo, useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrashIcon } from '@heroicons/react/20/solid';
import JobCard from '@/components/JobCard';
import { Column, Id, Job } from '@/types';
import { JobsModel } from '@/repos/JobsRepository';

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  updateJob: (id: Id, newJob: Job) => void;
  deleteJob: (id: Id) => void;
  jobs: JobsModel[];
}

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  jobs,
  deleteJob,
  updateJob,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  const jobsIds = useMemo(() => {
    return jobs.map((job) => job.id);
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

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // if (isDragging) {
  //   return (
  //     <div
  //       ref={setNodeRef}
  //       style={style}
  //       className="bg-my-color1 opacity-40 border-2 border-red-600 w-[350px] min-h-[600px] max-h-[600px] rounded-md flex flex-col"
  //     ></div>
  //   );
  // }

  return (
    <div
      ref={setNodeRef}
      // style={style}
      className="bg-my-color9 w-[350px] min-h-[600px] max-h-[600px] rounded-md flex flex-col"
    >
      {/* Column title */}
      <div
        // {...attributes}
        // {...listeners}
        onClick={() => {
          // setEditMode(true);
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
              onChange={(e) => updateColumn(column.id, e.target.value)}
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
        {/* <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="stroke-gray-500 hover:stroke-white hover:bg-my-color7 rounded px-1 py-2"
        >
          <TrashIcon className="h-6 w-6" />
        </button> */}
      </div>

      {/* Column job container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={jobsIds}>
          {jobs.map((job) => (
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
