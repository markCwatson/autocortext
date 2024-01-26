'use client';

import { useEffect, useMemo, useState } from 'react';
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
    id: 1,
    columnId: 'todo',
    title: 'Reprogram PLC',
    description: 'The PLC needs to be reprogrammed. Use the latest version.',
  },
  {
    id: 2,
    columnId: 'todo',
    title: 'Fix the lathe',
    description: 'The lathe is broken. It has a broken shaft.',
  },
  {
    id: 3,
    columnId: 'doing',
    title: 'Tighten the belt on the conveyor',
    description: 'The belt is loose. It should be tightened to avoid slipping.',
  },
  {
    id: 4,
    columnId: 'done',
    title: 'Fix the milling machine',
    description:
      'The milling machine will not power on. I think the fuse is blown.',
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

  function createJob({ title = '', description = '' }) {
    const newJob: Job = {
      id: generateId(),
      columnId: 'todo',
      title,
      description,
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

    console.log('DRAG END');

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
        const activeIndex = jobs.findIndex((t) => t.id === activeId);
        const overIndex = jobs.findIndex((t) => t.id === overId);

        if (jobs[activeIndex].columnId != jobs[overIndex].columnId) {
          // Fix introduced after video recording
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
        console.log('DROPPING TASK OVER COLUMN', { activeIndex });
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
          className="flex gap-2 items-center border-my-color7 border-2 rounded-md p-4 hover:bg-my-color7 active:bg-black"
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
          className="flex gap-2 items-center border-my-color7 border-2 rounded-md p-4 hover:bg-my-color7 active:bg-black"
        >
          <PlusIcon className="h-6 w-6" />
          Add a Column
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
        setJobDetails={({ title, description }) => {
          createJob({ title, description });
        }}
        setIsOpen={setIsCreateJobOpen}
      />
    </>
  );
}
