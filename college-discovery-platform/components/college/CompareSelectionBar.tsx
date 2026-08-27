import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface CompareSelectionBarProps {
  selectedSlugs: string[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export function CompareSelectionBar({ selectedSlugs, onRemove, onClear }: CompareSelectionBarProps) {
  if (selectedSlugs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg p-4 animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {selectedSlugs.map((slug, i) => (
              <div 
                key={slug} 
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-background bg-muted text-xs font-bold uppercase relative group"
                title={slug}
              >
                {slug.substring(0, 2)}
                <button
                  onClick={() => onRemove(slug)}
                  className="absolute -top-1 -right-1 bg-danger text-danger-foreground rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${slug}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="text-sm">
            <span className="font-semibold">{selectedSlugs.length}/3</span> colleges selected
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" onClick={onClear} className="text-muted-foreground w-full sm:w-auto">
            Clear
          </Button>
          <Link href={`/compare?slugs=${selectedSlugs.join(',')}`} className="w-full sm:w-auto">
            <Button variant="primary" disabled={selectedSlugs.length < 2} className="w-full">
              Compare Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
