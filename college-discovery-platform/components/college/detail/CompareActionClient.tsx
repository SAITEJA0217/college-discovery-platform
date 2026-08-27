'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useCompareState } from '@/lib/hooks/useCompareState';

export function CompareActionClient({ slug }: { slug: string }) {
  const { selectedSlugs, toggleCompare, canCompareMore, isInitialized } = useCompareState();

  // Don't render until client hydration finishes to avoid layout shift
  if (!isInitialized) {
    return <Button variant="outline" disabled className="w-full sm:w-auto">Compare</Button>;
  }

  const isSelected = selectedSlugs.includes(slug);
  const disabled = !isSelected && !canCompareMore;

  return (
    <Button 
      variant={isSelected ? "secondary" : "outline"} 
      onClick={() => toggleCompare(slug)}
      disabled={disabled}
      className="w-full sm:w-auto"
    >
      {isSelected ? 'Remove from Compare' : 'Add to Compare'}
    </Button>
  );
}
