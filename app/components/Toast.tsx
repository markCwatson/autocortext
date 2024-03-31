'use client';

import * as React from 'react';
import hotToast, { Toaster as HotToaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';

export const Toaster = HotToaster;

export const Icons = {
  warning: (
    <ExclamationTriangleIcon
      className="h-5 w-5 text-yellow-400"
      aria-hidden="true"
    />
  ),
  error: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />,
  success: (
    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
  ),
  info: (
    <InformationCircleIcon
      className="h-5 w-5 text-blue-400"
      aria-hidden="true"
    />
  ),
};

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
}

interface ToastIconProps extends Partial<React.SVGProps<SVGSVGElement>> {
  type: keyof typeof Icons;
}

interface ToastTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface ToastDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

interface ToastOpts {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// uses tailwindcss-animate for animations
export function Toast({ visible, className, ...props }: ToastProps) {
  return (
    <div
      className={cn(
        'min-h-16 mb-2 flex w-[350px] flex-col items-start gap-1 rounded-md px-6 py-4 shadow-md',
        visible && 'animate-in slide-in-from-right duration-250',
        className,
      )}
      {...props}
    />
  );
}

Toast.Icon = function ToastIcon({ type, className, ...props }: ToastIconProps) {
  return Icons[type];
};

Toast.Title = function ToastTitle({ className, ...props }: ToastTitleProps) {
  return <p className={cn('text-sm font-medium', className)} {...props} />;
};

Toast.Description = function ToastDescription({
  className,
  ...props
}: ToastDescriptionProps) {
  return (
    <div className={cn('mt-2 text-sm', className)}>
      <p {...props} />
    </div>
  );
};

export function toast(opts: ToastOpts) {
  const { title, message, type = 'success', duration = 4000 } = opts;

  const textStyles = {
    error: 'text-red-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return hotToast.custom(
    ({ visible }) => (
      <Toast
        visible={visible}
        className={cn({
          'bg-red-50 text-red-800': type === 'error',
          'bg-green-50 text-green-800': type === 'success',
          'bg-yellow-50 text-yellow-800': type === 'warning',
          'bg-blue-50 text-blue-800': type === 'info',
        })}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <Toast.Icon type={type} />
          </div>
          <div className="ml-3">
            <Toast.Title
              className={cn(textStyles[type as keyof typeof textStyles])}
            >
              {title}
            </Toast.Title>
            {message && (
              <Toast.Description
                className={cn(textStyles[type as keyof typeof textStyles])}
              >
                {message}
              </Toast.Description>
            )}
          </div>
        </div>
      </Toast>
    ),
    { duration },
  );
}
