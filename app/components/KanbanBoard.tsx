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
import { arrayMove } from '@dnd-kit/sortable';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Activity, Column, Id, Job } from '@/types';
import JobCard from '@/components/JobCard';
import ColumnContainer from '@/components/ColumnContainer';
import { isClientCtx } from '@/components/ClientCtxProvider';
import CreateJob from '@/components/CreateJob';
import { useUserContext } from '@/components/UserProvider';
import { toast } from './Toast';
import { JobsModel } from '@/repos/JobsRepository';
import DropdownButton from './DropdownButton';
import { machines } from '@/lib/machines';

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

interface KanbanBoardProps {
  jobs: JobsModel[];
  fetchJobs: (companyId: string) => void;
}

export default function KanbanBoard(props: KanbanBoardProps) {
  const userValue = useUserContext();

  const [columns, ] = useState<Column[]>(defaultCols);
  const [jobs, setJobs] = useState<JobsModel[]>(props.jobs);
  const [activeColumn, ] = useState<Column | null>(null);
  const [activeJob, setActiveJob] = useState<JobsModel | null>(null);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [filter, setFilter] = useState(machines[0]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const isClient = isClientCtx();

  useEffect(() => {
    setJobs(props.jobs);
  }, [props.jobs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  async function createJob({
    title,
    description,
    severity,
    machine,
  }: {
    title: string;
    description: string;
    severity: 'Severe' | 'High' | 'Medium' | 'Low';
    machine: string;
  }) {
    const newJob: Job = {
      id: props.jobs.length + 1,
      columnId: 'todo',
      title,
      description,
      severity,
      machine,
      creatorId: userValue.user.id!,
      companyId: userValue.user.companyId as string,
    };

    let res = await fetch('/api/job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error creating job',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    const createdJob = await res.json();

    const createdActivity: Activity = {
      id: 1,
      type: 'created',
      person: {
        name: userValue.user.name,
        img: userValue.user.image || '',
      },
      dateTime: new Date().toISOString(),
      jobId: createdJob._id,
    };

    res = await fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createdActivity),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: "Error creating 'created' action",
        type: 'error',
        duration: 2000,
      });
      return;
    }

    toast({
      title: 'Success',
      message: 'Job created',
      type: 'success',
      duration: 2000,
    });

    props.fetchJobs(userValue.user.companyId as string);
  }

  async function deleteJob(id: Id) {
    let res = await fetch(`/api/job`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, companyId: userValue.user.companyId }),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error deleting job',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    const deletedJob = await res.json();

    res = await fetch(`/api/activity`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId: deletedJob?._id }),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error deleting job activities',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    toast({
      title: 'Success',
      message: 'Job deleted',
      type: 'success',
      duration: 2000,
    });

    props.fetchJobs(userValue.user.companyId as string);
  }

  // todo: probably don't need id here
  async function updateJob(
    updatedJob: Job,
    type?:
      | 'created'
      | 'commented'
      | 'edited'
      | 'started'
      | 'paused'
      | 'finished',
  ) {
    let res = await fetch(`/api/job`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job: updatedJob }),
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error updating job',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    if (type) {
      const editedActivity: Activity = {
        id: updatedJob.activities?.length ? updatedJob.activities?.length + 1 : 1,
        type,
        person: {
          name: userValue.user.name,
          img: userValue.user.image || '',
        },
        dateTime: new Date().toISOString(),
        jobId: (updatedJob as JobsModel)._id, // todo: consider using only one type throughout
      };

      res = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedActivity),
      });

      toast({
        title: 'Success',
        message: 'Job updated',
        type: 'success',
        duration: 2000,
      });
    }

    props.fetchJobs(userValue.user.companyId as string);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Job') {
      setActiveJob(event.active.data.current.job);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveJob(null);
  }

  async function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAJob = active.data.current?.type === 'Job';
    const isOverAJob = over.data.current?.type === 'Job';

    if (!isActiveAJob) return;

    const activeIndex = jobs.findIndex((job) => job.id === activeId);
    let previousColumn = jobs[activeIndex].columnId;

    // Im dropping a Job over another Job
    if (isActiveAJob && isOverAJob) {
      setJobs((jobs) => {
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
        if (previousColumn === overId) return jobs;

        jobs[activeIndex].columnId = overId;
        return arrayMove(jobs, activeIndex, activeIndex);
      });

    }

    const updatedJob = props.jobs.find((job) => job.id === activeId);
    if (updatedJob) {
      switch (updatedJob.columnId) {
        case 'doing':
          if (previousColumn === 'doing') break;
          await updateJob(updatedJob, 'started');
          break;
        case 'done':
          if (previousColumn === 'done') break;
          await updateJob(updatedJob, 'finished');
          break;
        case 'todo':
          if (previousColumn === 'todo') break;
          await updateJob(updatedJob, 'paused');
          break;
        default:
          await updateJob(updatedJob);
          break;
      }
    }
  }

  return (
    <>
      <div className="flex justify-evenly items-center py-4">
        <button
          className="flex gap-2 items-center border-my-color7 border-2 rounded-md p-2 hover:bg-my-color7 active:bg-black"
          onClick={() => {
            setIsCreateJobOpen(true);
          }}
        >
          <PlusIcon className="h-6 w-6" />
          Create a new job
        </button>
        <div className="flex justify-center items-center gap-2 z-10">
          <p className="text-my-color1">Filter by machine:</p>
          <DropdownButton
            selection={filter}
            listItems={machines}
            color="ghost"
            handler={(item) => setFilter(item)}
          />
        </div>
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
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteJob={deleteJob}
                  updateJob={updateJob}
                  jobs={props.jobs?.filter(
                    (job) =>
                      job.columnId === col.id &&
                      (filter !== machines[0] ? job.machine === filter : true),
                  )}
                />
              ))}
            </div>
          </div>

          {isClient &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteJob={deleteJob}
                    updateJob={updateJob}
                    jobs={props.jobs.filter((job) =>
                      job.columnId === activeColumn.id && filter !== machines[0]
                        ? job.machine === filter
                        : true,
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
        setJobDetails={({ title, description, severity, machine }) => {
          createJob({ title, description, severity, machine });
        }}
        setIsOpen={setIsCreateJobOpen}
      />
    </>
  );
}
