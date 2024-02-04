import { useState } from 'react';
import { Id, Job } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bars2Icon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import JobModal from './JobModal';
import { JobsModel } from '@/repos/JobsRepository';

interface Props {
  job: JobsModel;
  deleteJob: (id: Id) => void;
  updateJob: (
    id: Id,
    newJob: Job,
    type?:
      | 'created'
      | 'commented'
      | 'edited'
      | 'started'
      | 'finished'
      | 'paused',
  ) => void;
}

const severityMap = {
  Severe: <ChevronDoubleUpIcon className="h-5 w-5 text-red-600" />,
  High: <ChevronUpIcon className="h-5 w-5 text-yellow-600" />,
  Medium: <Bars2Icon className="h-5 w-5 text-blue-600" />,
  Low: <ChevronDownIcon className="h-5 w-5 text-green-600" />,
};

export default function JobCard({ job, deleteJob, updateJob }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(job.title);
  const [editedDescription, setEditedDescription] = useState(job.description);
  const [openAiAssistant, setOpenAiAssistant] = useState(false);
  const [editedActivities, setEditedActivities] = useState(job.activities);

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
    updateJob(
      job.id,
      {
        ...job,
        title: editedTitle,
        description: editedDescription,
        activities: editedActivities,
      },
      'edited',
    );
    setEditMode(false);
  };

  const handleClose = () => {
    updateJob(job.id, {
      ...job,
      activities: editedActivities,
    });
    setEditMode(false);
  };

  const draggingStyle = isDragging
    ? { opacity: 0.3, border: '2px solid #rose-500' }
    : {};

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {/** todo: handle when they do not click on modal */}
        <JobModal
          title={editedTitle}
          setTitle={setEditedTitle}
          description={editedDescription}
          setDescription={setEditedDescription}
          setActivities={setEditedActivities}
          onSave={handleSave}
          onClose={handleClose}
          job={job}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...draggingStyle }}
      {...attributes}
      {...listeners}
      className="flex flex-col bg-my-color8 p-2.5 justify-center rounded-xl hover:ring-2 hover:ring-inset hover:ring-my-color5 cursor-grab relative job"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center px-2 py-1 text-xs">
            <p>{'Ref# '}</p>
            <p className="pl-2">{job.id}</p>
          </div>
          <p className="">{severityMap[job.severity]}</p>
        </div>
        <div onClick={toggleEditMode}>
          <div className="flex flex-col gap-2 border border-gray-400 p-2.5 items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-my-color5 cursor-grab relative job">
            <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-md">
              {job.title}
            </p>
            {/* <p className="my-auto w-full h-[80px] overflow-y-scroll overflow-x-hidden whitespace-pre-wrap text-sm">
              {job.description}
            </p> */}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center pt-2.5 px-2.5">
        <button
          onClick={() => {
            deleteJob(job.id);
          }}
          className="stroke-white rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
