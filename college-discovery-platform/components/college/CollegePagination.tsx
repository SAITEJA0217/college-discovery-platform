import React from 'react';
import { Button } from '@/components/ui/Button';

interface CollegePaginationProps {
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function CollegePagination({ currentPage, totalCount, limit, onPageChange }: CollegePaginationProps) {
  const totalPages = Math.ceil(totalCount / limit) || 1;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{Math.min((currentPage - 1) * limit + 1, totalCount)}</span> to{' '}
        <span className="font-medium text-foreground">{Math.min(currentPage * limit, totalCount)}</span> of{' '}
        <span className="font-medium text-foreground">{totalCount}</span> results
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <div className="text-sm font-medium px-4">
          Page {currentPage} of {totalPages}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
