import React, { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <select
        className={`flex h-10 w-full rounded-md border ${
          error ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
        } bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
