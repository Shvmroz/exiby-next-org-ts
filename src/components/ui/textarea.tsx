import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // base styles
          'w-full min-h-[80px] px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-sky-800',
          // light mode
          'bg-white text-black placeholder-gray-400 border-gray-300',
          // dark mode
          'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600',
          // disabled state
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
