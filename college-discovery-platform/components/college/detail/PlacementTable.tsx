import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrendingUp } from 'lucide-react';

export function PlacementTable({ placements }: { placements: any[] }) {
  if (!placements || placements.length === 0) {
    return (
      <EmptyState 
        title="No placement data" 
        description="Historical placement records are not available for this institution."
        icon={<TrendingUp className="h-10 w-10 text-muted-foreground" />}
      />
    );
  }

  // Sort newest year first
  const sortedPlacements = [...placements].sort((a, b) => b.year - a.year);

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Year</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Avg Package</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Median Package</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Highest Package</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Placement Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedPlacements.map((record) => (
              <tr key={record.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{record.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-success font-medium">
                  {formatCurrency(record.avgPackage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {formatCurrency(record.medianPackage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  {formatCurrency(record.highestPackage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {record.placementPercent ? `${record.placementPercent}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
