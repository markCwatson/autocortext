'use client';

import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Column, Id, Job } from '@/types';
import JobCard from '@/components/JobCard';
import ColumnContainer from '@/components/ColumnContainer';
import { isClientCtx } from '@/components/ClientCtxProvider';
import CreateJob from '@/components/CreateJob';

const defaultCols: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
  },
  {
    id: 'doing',
    title: 'In progress',
  },
  {
    id: 'done',
    title: 'Done',
  },
];

const defaultJobs: Job[] = [
  {
    id: 1178,
    columnId: 'todo',
    title: 'Reprogram conveyer computer',
    description:
      "The conveyer's computer needs to be reprogrammed. Use the latest version.",
    severity: 'Low',
    activities: [
      {
        id: 0,
        type: 'commented',
        person: {
          name: 'Chelsea Hagon',
          img: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        comment:
          'Does anyone know when this will be finished? I need it for a project I am working on.',
        date: '3d ago',
        dateTime: '2023-01-23T15:56',
      },
      {
        id: 1,
        type: 'created',
        person: { name: 'Chelsea Hagon' },
        date: '7d ago',
        dateTime: '2023-01-23T10:32',
      },
    ],
  },
  {
    id: 1232,
    columnId: 'todo',
    title: 'Fix lathe',
    description: 'The lathe is broken. It has a broken shaft.',
    severity: 'High',
    activities: [
      {
        id: 0,
        type: 'viewed',
        person: { name: 'Thomas Keizer' },
        date: '7d ago',
        dateTime: '2023-01-23T10:32',
      },
      {
        id: 1,
        type: 'viewed',
        person: { name: 'Bill Knewls' },
        date: '7d ago',
        dateTime: '2023-01-23T10:32',
      },
      {
        id: 3,
        type: 'created',
        person: { name: 'Matt Knox' },
        date: '7d ago',
        dateTime: '2023-01-23T10:32',
      },
    ],
  },
  {
    id: 3113,
    columnId: 'doing',
    title: 'Tighten belt on conveyor',
    description: 'The belt is loose. It should be tightened to avoid slipping.',
    severity: 'Medium',
    activities: [
      {
        id: 0,
        type: 'started',
        person: { name: 'Chelsea Hagon' },
        date: '1d ago',
        dateTime: '2023-01-29T10:32',
      },
      {
        id: 1,
        type: 'created',
        person: { name: 'Chelsea Hagon' },
        date: '7d ago',
        dateTime: '2023-01-23T10:32',
      },
    ],
  },
  {
    id: 8894,
    columnId: 'done',
    title: 'Replace cartoner fuse',
    description: 'The cartoner will not power on. I think the fuse is blown.',
    severity: 'Severe',
    activities: [
      {
        id: 0,
        type: 'finished',
        person: { name: 'Alex Curren' },
        date: '1d ago',
        dateTime: '2023-01-24T09:20',
      },
      {
        id: 1,
        type: 'viewed',
        person: { name: 'Alex Curren' },
        date: '2d ago',
        dateTime: '2023-01-24T09:12',
      },
      {
        id: 2,
        type: 'commented',
        person: {
          name: 'Chelsea Hagon',
          img: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        comment: 'Called Alex. He said the fuse is stuck.',
        date: '3d ago',
        dateTime: '2023-01-23T15:56',
      },
      {
        id: 3,
        type: 'edited',
        person: { name: 'Chelsea Hagon' },
        date: '6d ago',
        dateTime: '2023-01-23T11:03',
      },
      {
        id: 4,
        type: 'created',
        person: { name: 'Chelsea Hagon' },
        date: '7d ago',
        dateTime: '2023-01-23T10:32',
      },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [jobs, setJobs] = useState<Job[]>(defaultJobs);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const isClient = isClientCtx();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  function createJob({
    title,
    description,
    severity,
  }: {
    title: string;
    description: string;
    severity: 'Severe' | 'High' | 'Medium' | 'Low';
  }) {
    const newJob: Job = {
      id: generateId(),
      columnId: 'todo',
      title,
      description,
      severity,
    };

    setJobs([...jobs, newJob]);
  }

  function deleteJob(id: Id) {
    const newJobs = jobs.filter((job) => job.id !== id);
    setJobs(newJobs);
  }

  function updateJob(id: Id, newJob: Job) {
    const newJobs = jobs.map((job) => {
      if (job.id !== id) return job;
      return { ...job, ...newJob };
    });

    setJobs(newJobs);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newJobs = jobs.filter((t) => t.columnId !== id);
    setJobs(newJobs);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Job') {
      setActiveJob(event.active.data.current.job);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveJob(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAJob = active.data.current?.type === 'Job';
    const isOverAJob = over.data.current?.type === 'Job';

    if (!isActiveAJob) return;

    // Im dropping a Job over another Job
    if (isActiveAJob && isOverAJob) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((job) => job.id === activeId);
        const overIndex = jobs.findIndex((job) => job.id === overId);

        if (jobs[activeIndex].columnId != jobs[overIndex].columnId) {
          jobs[activeIndex].columnId = jobs[overIndex].columnId;
          return arrayMove(jobs, activeIndex, overIndex - 1);
        }

        return arrayMove(jobs, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    // Im dropping a Job over a column
    if (isActiveAJob && isOverAColumn) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((t) => t.id === activeId);

        jobs[activeIndex].columnId = overId;
        return arrayMove(jobs, activeIndex, activeIndex);
      });
    }
  }

  function generateId() {
    /* Generate a random number between 0 and 10000 */
    return Math.floor(Math.random() * 10001);
  }

  return (
    <>
      <div className="flex justify-evenly py-4">
        <button
          className="flex gap-2 items-center border-my-color7 border-2 rounded-md p-2 hover:bg-my-color7 active:bg-black"
          onClick={() => {
            setIsCreateJobOpen(true);
          }}
        >
          <PlusIcon className="h-6 w-6" />
          Add a new job
        </button>
        <button
          onClick={() => {
            createNewColumn();
          }}
          className="flex gap-2 items-center border-my-color7 border-2 rounded-md p-2 hover:bg-my-color7 active:bg-black"
        >
          <PlusIcon className="h-6 w-6" />
          Add a column
        </button>
      </div>
      <div className="m-auto flex w-full items-center overflow-x-scroll overflow-y-hidden px-4">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    deleteJob={deleteJob}
                    updateJob={updateJob}
                    jobs={jobs.filter((job) => job.columnId === col.id)}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          {isClient &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    deleteJob={deleteJob}
                    updateJob={updateJob}
                    jobs={jobs.filter(
                      (job) => job.columnId === activeColumn.id,
                    )}
                  />
                )}
                {activeJob && (
                  <JobCard
                    job={activeJob}
                    deleteJob={deleteJob}
                    updateJob={updateJob}
                  />
                )}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
      </div>
      <CreateJob
        isOpen={isCreateJobOpen}
        setJobDetails={({ title, description, severity }) => {
          createJob({ title, description, severity });
        }}
        setIsOpen={setIsCreateJobOpen}
      />
    </>
  );
}
