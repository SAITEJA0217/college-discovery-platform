import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "No results found", 
  description = "We couldn't find any matches for your current search or filters.", 
  icon = <SearchX className="h-12 w-12 text-muted-foreground" />,
  action 
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
