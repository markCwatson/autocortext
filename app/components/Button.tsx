import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'active:scale-80 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-my-color5 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-my-color2 disabled:pointer-events-none dark:focus:ring-offset-my-color10',
  {
    variants: {
      variant: {
        default: 'text-my-color1 bg-indigo-600',
        destructive: 'text-my-color1 hover:bg-red-600 dark:hover:bg-red-600',
        outline:
          'bg-transparent text-my-color1 border border-my-color1 hover:text-my-color9 hover:bg-my-color5',
        underline:
          'underline-offset-4 underline text-my-color10 dark:text-my-color1 dark:hover:bg-my-color8 dark:text-my-color1',
        subtle:
          'bg-my-color9 text-my-color1 hover:bg-my-color3 dark:bg-my-color1 dark:text-my-color10',
        ghost: 'bg-transparent hover:border hover:border-my-color1',
        link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-my-color10 dark:text-my-color1 hover:bg-transparent dark:hover:bg-transparent',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-12 px-4 rounded-md',
        nill: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, isLoading, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
