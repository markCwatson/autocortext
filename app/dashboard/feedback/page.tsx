'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from '@/components/Toast';
import { useUserContext } from '@/providers/UserProvider';
import Table, { TableColumn } from '@/components/Table';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { PencilLineIcon } from 'lucide-react';
import { FeedbackModel } from '@/repos/FeedbackRepository';
import { mainContainerStyle } from '@/lib/mainContainerStyle';
import { ASCEND_ADMIN_ROLE } from '@/lib/constants';

const columns: TableColumn[] = [
  {
    header: 'Feedback',
    accessor: 'feedback',
    render: (feedback: FeedbackModel) => (
      <div className="text-sm font-medium leading-6 text-white">
        {feedback.name}
      </div>
    ),
  },
  {
    header: 'Company',
    accessor: 'feedback',
    render: (feedback: FeedbackModel) => (
      <div className="text-sm font-medium leading-6 text-white">
        {feedback.company}
      </div>
    ),
  },
  {
    header: 'Email',
    accessor: 'feedback',
    render: (feedback: FeedbackModel) => (
      <div className="text-sm font-medium leading-6 text-white">
        {feedback.email}
      </div>
    ),
  },
];

const Feedback: React.FC = () => {
  const userValue = useUserContext();
  const [info, setInfo] = useState<FeedbackModel>({
    name: `${userValue.user.name}`,
    email: `${userValue.user.email}`,
    message: '',
    company: `${userValue.user.companyName}`,
  });
  const [feedback, setFeedback] = useState<FeedbackModel[] | null>(null);
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackModel | null>(null);

  useEffect(() => {
    if (userValue.user.role === ASCEND_ADMIN_ROLE) {
      fetchFeedback();
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInfo({ ...info });

    const res = await fetch(
      `/api/feedback?companyId=${userValue.user.companyId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      },
    );

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error submitting feedback',
        type: 'error',
      });

      return;
    }

    toast({
      title: 'Success',
      message: 'Thank you for your feedback!',
      type: 'success',
    });

    setInfo({
      name: `${userValue.user.name}`,
      email: `${userValue.user.email}`,
      message: '',
      company: `${userValue.user.companyName}`,
    });
  };

  const handleChange =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfo({ ...info, [name]: e.target.value });
    };

  const fetchFeedback = async () => {
    const res = await fetch('/api/feedback');
    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error fetching feedback',
        type: 'error',
      });

      return;
    }

    toast({
      title: 'Success',
      message: 'Feedback fetched successfully',
      type: 'success',
    });

    const data = await res.json();
    setFeedback(data);
  };

  const handleSelectFeedback = (feedbackItem: FeedbackModel) => {
    setSelectedFeedback(feedbackItem);
  };

  const handleMarkFeedbackAsRead = async () => {
    if (!selectedFeedback) {
      toast({
        title: 'Error',
        message: 'No feedback selected',
        type: 'error',
      });
      return;
    }

    const res = await fetch(`/api/feedback?id=${selectedFeedback._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error marking feedback as read',
        type: 'error',
      });

      return;
    }

    toast({
      title: 'Success',
      message: 'Feedback marked as read',
      type: 'success',
    });

    fetchFeedback();
    setSelectedFeedback(null);
  };

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8" style={mainContainerStyle}>
      <div className="h-full w-full">
        {/** Only AscendAdmin can view feedback */}
        {userValue.user.role === ASCEND_ADMIN_ROLE ? (
          <div className="h-full w-full grid p-2 grid-cols-8 gap-x-4 gap-y-10">
            <div className="bg-transparent col-span-1" />
            <div className="lg:col-span-3 bg-my-color7 border rounded-md overflow-scroll">
              <div className="flex flex-col gap-2 w-full h-full overflow-scroll pt-4 border">
                {feedback !== null ? (
                  <Table
                    data={
                      feedback.length > 0
                        ? feedback
                        : [
                            {
                              name: 'No feedback available',
                              email: '',
                              message: '',
                              company: '',
                            },
                          ]
                    }
                    columns={columns}
                    onSelect={handleSelectFeedback}
                  />
                ) : (
                  <div className="flex flex-col py-24 w-full h-full items-center">
                    <ArrowPathIcon
                      className="h-6 w-6 text-green-600 animate-spin"
                      aria-hidden="true"
                    />
                    Loading feedback...
                  </div>
                )}
              </div>
            </div>
            {/* Render selected feedback details here */}
            <div className="col-span-3 bg-my-color7 w-full h-full border rounded-md overflow-scroll text-sm">
              <div className="p-2 flex justify-between border-b items-center">
                <h3 className="text-md font-medium">
                  Selected Feedback Details:
                </h3>
                <button
                  onClick={handleMarkFeedbackAsRead}
                  className={`p-2 rounded ${
                    selectedFeedback !== null
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-400'
                  }`}
                >
                  {'Mark as Read'}
                </button>
              </div>
              {selectedFeedback ? (
                <div className="m-4">
                  <p>
                    <strong>Name:</strong> {selectedFeedback.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedFeedback.email}
                  </p>
                  <p>
                    <strong>Company:</strong> {selectedFeedback.company}
                  </p>
                  <p className="mt-2">
                    <strong>Message:</strong> {selectedFeedback.message}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col col-span-3 mt-10 justify-center items-center">
                  <PencilLineIcon
                    className="h-6 w-6 text-green-600 animate-bounce mb-4"
                    aria-hidden="true"
                  />
                  Select an entry to view feedback details
                </div>
              )}
            </div>
            <div className="bg-transparent col-span-1" />
          </div>
        ) : (
          <>
            {/* Only non-AscendAdmin users can submit feedback */}
            <div className="grid p-2 grid-cols-3 gap-x-4 gap-y-10 mt-12">
              <div className="bg-transparent col-span-1" />
              <form
                onSubmit={handleSubmit}
                className="text-sm space-y-4 text-my-color1 border rounded-md p-4 bg-my-color7"
              >
                <div className="flex flex-col mt-2">
                  <label htmlFor="name" className="font-semibold">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={info.name}
                    className="mt-1 p-2 border border-gray-300 rounded text-my-color5 text-sm"
                    placeholder={info.name}
                    disabled
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="company" className="font-semibold">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={info.company}
                    className="mt-1 p-2 border border-gray-300 rounded text-my-color5 text-sm"
                    placeholder={info.company}
                    disabled
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-semibold">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={info.email}
                    className="mt-1 p-2 border border-gray-300 rounded text-my-color5 text-sm"
                    placeholder={info.email}
                    disabled
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="message" className="font-semibold">
                    Feedback or bug report
                  </label>
                  <textarea
                    id="message"
                    value={info.message}
                    onChange={handleChange('message')}
                    className="mt-1 p-2 border border-gray-300 rounded text-my-color10 text-sm"
                    rows={8}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {'Submit'}
                  </button>
                </div>
              </form>
              <div className="bg-transparent col-span-1" />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Feedback;
