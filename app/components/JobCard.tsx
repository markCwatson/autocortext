import { useState } from 'react';
import { Id, Job } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrashIcon } from '@heroicons/react/20/solid';

interface Props {
  job: Job;
  deleteJob: (id: Id) => void;
  updateJob: (id: Id, newJob: Job) => void;
}

export default function JobCard({ job, deleteJob, updateJob }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(job.title);
  const [editedDescription, setEditedDescription] = useState(job.description);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: 'Job',
      job,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const handleSave = () => {
    updateJob(job.id, {
      ...job,
      title: editedTitle,
      description: editedDescription,
    });
    setEditMode(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-my-color1 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-my-color7 p-2.5 h-[150px] min-h-[150px] items-center flex flex-col text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-my-color3 cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Job title here"
        />
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Job description here"
        />
        <button
          onClick={handleSave}
          className="mt-2 rounded bg-indigo-600 py-2 px-4 text-white"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-my-color8 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-my-color5 cursor-grab relative job"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {job.title}
        </p>
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {job.description}
        </p>
      </div>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteJob(job.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-my-color9 p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
