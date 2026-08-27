import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileBarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function CutoffTable({ cutoffs }: { cutoffs: any[] }) {
  if (!cutoffs || cutoffs.length === 0) {
    return (
      <EmptyState 
        title="No cutoff data" 
        description="Historical cutoffs are not available for this institution."
        icon={<FileBarChart2 className="h-10 w-10 text-muted-foreground" />}
      />
    );
  }

  // Sort newest year first
  const sortedCutoffs = [...cutoffs].sort((a, b) => b.admissionYear - a.admissionYear);

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Exam</th>
              <th className="px-6 py-4 whitespace-nowrap">Category</th>
              <th className="px-6 py-4 whitespace-nowrap">Course</th>
              <th className="px-6 py-4 whitespace-nowrap">Year</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Opening Rank</th>
              <th className="px-6 py-4 whitespace-nowrap text-right text-primary">Closing Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCutoffs.map((cutoff) => (
              <tr key={cutoff.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{cutoff.exam.replace('_', ' ')}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cutoff.category}</td>
                <td className="px-6 py-4">
                  {cutoff.course ? cutoff.course.name : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cutoff.admissionYear}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-muted-foreground">
                  {cutoff.openingRank || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-primary">
                  {cutoff.closingRank}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
