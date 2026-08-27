import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an unexpected error while loading the data. Please try again.",
  retryAction
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-danger/20 bg-danger/5 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-6 w-6 text-danger" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-danger">{title}</h3>
      <p className="mt-2 text-sm text-danger/80 max-w-md">
        {description}
      </p>
      {retryAction && (
        <button 
          onClick={retryAction}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground hover:bg-danger/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
