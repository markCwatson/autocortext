'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import Table, { TableColumn } from '@/components/Table';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/Button';
import { Building2Icon, UserCheck2 } from 'lucide-react';
import { TrashIcon } from '@heroicons/react/20/solid';
import classNames from '@/lib/classNames';
import { toast } from '@/components/Toast';
import { useUserContext } from '@/providers/UserProvider';
import { Company } from '@/services/CompanyService';
import { User } from 'next-auth';
import { CompanyModel } from '@/repos/CompanyRepository';
import { mainContainerStyle } from '@/lib/mainContainerStyle';
import { ASCEND_ADMIN_ROLE, ADMIN_ROLE } from '@/lib/constants';
import DropdownButton from '@/components/DropdownButton';

const columnStyle: CSSProperties = {
  height: '100%',
};

interface ButtonProps {
  title: string;
  icon:
    | React.ForwardRefExoticComponent<any>
    | React.FC<React.SVGProps<SVGSVGElement>>;
  handler: () => void;
  disabled: boolean;
}

export default function Dashboard() {
  const userValue = useUserContext();
  const [users, setUsers] = useState<User[] | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{
    companyId: string | null;
    companyName: string;
  }>({
    companyId: null,
    companyName: '',
  });

  const userColumns: TableColumn[] = [
    {
      header: 'User',
      accessor: 'user',
      render: (user: User) => (
        <div className="text-sm font-medium leading-6 text-white">
          {user.name}
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'user',
      render: (user: User) => {
        const statusColor =
          user.role === ASCEND_ADMIN_ROLE || user.role === ADMIN_ROLE
            ? 'text-green-400 bg-green-400/10'
            : 'text-blue-400 bg-blue-400/10';

        return (
          <div className="flex items-center justify-end gap-x-2 sm:justify-start">
            <div className={statusColor + ' flex-none rounded-full p-1'}>
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
            </div>
            <div className="hidden text-white sm:block">{user.role}</div>
          </div>
        );
      },
    },
    {
      header: 'Email',
      accessor: 'user',
      render: (user: User) => {
        return <div className="hidden text-white sm:block">{user.email}</div>;
      },
    },
    {
      header: '',
      accessor: 'user',
      render: (user: User) => (
        <div className="flex items-center gap-x-4">
          <TrashIcon
            className={`h-4 w-4 text-white opacity-20 ${
              userValue.user.id === user.id!
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:opacity-100'
            }`}
            onClick={() => deleteUser(user.id!)}
          />
        </div>
      ),
    },
  ];

  const companyColumns: TableColumn[] = [
    {
      header: 'Company name',
      accessor: 'company',
      render: (company: Company) => (
        <div className="flex items-center gap-x-4">
          <div className="truncate text-sm font-medium leading-6 text-white">
            {company.name}
          </div>
        </div>
      ),
    },
    {
      header: '',
      accessor: 'company',
      render: (company: Company) => (
        <div className="flex items-center gap-x-4">
          <DropdownButton
            selection={''}
            listItems={['delete']}
            color="ghost"
            handler={(item) =>
              item === 'delete' && deleteCompany(company._id!.toString())
            }
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (userValue.user.role !== ASCEND_ADMIN_ROLE) {
      setSelectedCompany({
        companyId: userValue.user.companyId as string,
        companyName: userValue.user.companyName,
      });
    } else {
      fetchCompanies();
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [selectedCompany]);

  const fetchUsers = async () => {
    if (!selectedCompany.companyId) return;
    let res;

    try {
      res = await fetch(
        `/api/company/users?companyId=${selectedCompany.companyId as string}`,
      );
      if (!res?.ok) {
        toast({
          title: 'Error',
          message: 'Error fetching users',
          type: 'error',
          duration: 2000,
        });
        return;
      }
    } catch (error) {
      console.log('error on page:', error);
      toast({
        title: 'Error',
        message: 'Something went wrong while fetching users',
        type: 'error',
        duration: 2000,
      });
    }

    if (!res) {
      toast({
        title: 'Error',
        message: 'Error fetching users. No response.',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    const data = await res.json();
    setUsers(data);
  };

  const fetchCompanies = async () => {
    const res = await fetch('/api/company/all');
    if (!res.ok) {
      toast({
        title: 'Error',
        message: 'Error fetching companies',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    const data = await res.json();
    setCompanies(data);
  };

  const createCompany = async () => {
    const name = prompt('Enter company name');
    if (!name) return;

    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        toast({
          title: 'Error',
          message: 'Error creating company',
          type: 'error',
          duration: 2000,
        });
        return;
      }

      toast({
        title: 'Success',
        message: 'Company and index created!',
        type: 'success',
        duration: 2000,
      });

      fetchCompanies();
    } catch (error) {
      console.log('error on page:', error);
      toast({
        title: 'Error',
        message: 'Something went wrong while creating an account',
        type: 'error',
        duration: 2000,
      });
    }
  };

  const deleteCompany = async (companyId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this company? This action will delete ALL data associated with this company and CANNOT be undone.',
      )
    )
      return;

    if (
      !confirm(
        'Are you 100% sure? Again, this deletes EVERYTHING, and FOREVER.',
      )
    )
      return;

    try {
      const res = await fetch(`/api/company?companyId=${companyId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast({
          title: 'Error',
          message: 'Error deleting company',
          type: 'error',
          duration: 2000,
        });
        return;
      }

      toast({
        title: 'Success',
        message: 'Company deleted!',
        type: 'success',
        duration: 2000,
      });

      fetchCompanies();
      fetchUsers();
    } catch (error) {
      console.log('error on page:', error);
      toast({
        title: 'Error',
        message: 'Something went wrong while deleting company',
        type: 'error',
        duration: 2000,
      });
    }
  };

  const createUser = async () => {
    const name = prompt('Enter user name');
    if (!name) return;
    const password = prompt('Enter temporary password');
    if (!password) return;
    const email = prompt('Enter email');
    if (!email) return;

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          email,
          name,
          companyId: selectedCompany.companyId,
          companyName: selectedCompany.companyName,
        }),
      });

      if (!response.ok) {
        toast({
          title: 'Error creating account',
          message: 'Please try again later.',
          type: 'error',
        });
        return;
      }

      toast({
        title: 'Success',
        message: 'Account created!',
      });

      fetchUsers();
    } catch (error) {
      console.log('error on page:', error);
      toast({
        title: 'Error creating account',
        message: `${error}`,
        type: 'error',
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (userValue.user.id === userId) {
      toast({
        title: 'Error deleting account',
        message: 'You cannot delete your own account',
        type: 'error',
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/user?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast({
          title: 'Error deleting account',
          message: 'Please try again later.',
          type: 'error',
        });
        return;
      }

      toast({
        title: 'Success',
        message: 'Account deleted!',
      });

      fetchUsers();
    } catch (error) {
      console.log('error on page:', error);
      toast({
        title: 'Error deleting account',
        message: `${error}`,
        type: 'error',
      });
    }
  };

  const buttons: ButtonProps[] =
    userValue.user.role === ASCEND_ADMIN_ROLE
      ? [
          {
            title: 'Create company',
            icon: Building2Icon,
            handler: createCompany,
            disabled: false,
          },
          {
            title: 'Create account',
            icon: UserCheck2,
            handler: createUser,
            disabled: !selectedCompany.companyId,
          },
        ]
      : [
          {
            title: 'Create account',
            icon: UserCheck2,
            handler: createUser,
            disabled: !selectedCompany.companyId,
          },
        ];

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 " style={mainContainerStyle}>
      <div
        className={`grid pt-2 grid-cols-1 lg:grid-cols-12 gap-x-4 gap-y-10`}
        style={columnStyle}
      >
        {/* Left empty div */}
        <div
          className={`bg-transparent lg:visible ${
            userValue.user.role === ASCEND_ADMIN_ROLE
              ? 'lg:col-span-1'
              : 'lg:col-span-3'
          }`}
        />
        {/** Companies */}
        {userValue.user.role === ASCEND_ADMIN_ROLE && (
          <div className="lg:col-span-3 bg-my-color8 border rounded overflow-visible">
            {/* todo: overflow-visible required here to allow summary popover.
            This causes history list to grow. Consider doing something else. */}
            <div className="flex flex-col gap-2 w-full h-full overflow-visible pt-4">
              {companies.length > 0 ? (
                <Table
                  data={companies}
                  columns={companyColumns}
                  onSelect={(selected: CompanyModel) =>
                    setSelectedCompany({
                      companyId: selected._id ? selected._id.toString() : null,
                      companyName: selected.name,
                    })
                  }
                />
              ) : (
                <div className="flex flex-col py-24 w-full h-full items-center">
                  <ArrowPathIcon
                    className="h-6 w-6 text-green-600 animate-spin"
                    aria-hidden="true"
                  />
                  Loading companies...
                </div>
              )}
            </div>
          </div>
        )}
        {/* Users */}
        <div
          className={`${
            userValue.user.role === ASCEND_ADMIN_ROLE
              ? 'lg:col-span-5'
              : 'lg:col-span-5'
          } pb-8 bg-my-color8 border rounded overflow-scroll`}
        >
          <div className="flex flex-col gap-2 w-full h-full overflow-visible pt-4">
            {users ? (
              <Table data={users} columns={userColumns} />
            ) : selectedCompany.companyId ? (
              <div className="flex flex-col py-24 w-full h-full items-center">
                <ArrowPathIcon
                  className="h-6 w-6 text-green-600 animate-spin"
                  aria-hidden="true"
                />
                Loading users...
              </div>
            ) : (
              <div className="flex flex-col py-24 w-full h-full items-center">
                <Building2Icon
                  className="h-6 w-6 text-green-600 animate-bounce mb-4"
                  aria-hidden="true"
                />
                Select a company to view users
              </div>
            )}
          </div>
        </div>
        {/* Buttons */}
        <div className="bg-transparent lg:visible lg:col-span-2">
          <div className="w-full h-full pt-14">
            <ul role="list" className="space-y-2 mx-1">
              {buttons.map((b) => (
                <li key={b.title}>
                  <Button
                    size={'lg'}
                    onClick={b.handler}
                    className={classNames(
                      'text-my-color1 hover:bg-my-color4',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                      'w-full px-10 justify-start',
                    )}
                    disabled={b.disabled}
                  >
                    <b.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {b.title}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right empty div */}
        <div
          className={`bg-transparent lg:visible ${
            userValue.user.role === ASCEND_ADMIN_ROLE
              ? 'lg:col-span-1'
              : 'lg:col-span-2'
          }`}
        />
      </div>
    </main>
  );
}
