'use client';

import { FormEventHandler, useState } from 'react';
import { Logo } from '@/components/Logo';
import { toast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [info, setInfo] = useState({ name: '', email: '', password: '' });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...info,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          message: 'Account created! Please sign in.',
        });
        router.push('/');
      } else {
        toast({
          title: 'Error creating account',
          message: 'Please try again later.',
          type: 'error',
        });
      }
    } catch (error) {
      console.log('error on page:', error);
      toast({
        title: 'Error resigering',
        message: `${error}`,
        type: 'error',
      });
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
          Register an account with <Logo />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Enter your name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={info.name}
                    autoComplete="name"
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    placeholder="Jane Doe"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Enter your email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={info.email}
                    autoComplete="email"
                    onChange={(e) =>
                      setInfo({ ...info, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Chose a password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={info.password}
                    autoComplete="current-password"
                    onChange={(e) =>
                      setInfo({ ...info, password: e.target.value })
                    }
                    placeholder="********"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-my-color1">
            Already a member?{' '}
            <a
              href="/"
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
