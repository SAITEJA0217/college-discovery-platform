import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { CompareActionClient } from './CompareActionClient';

interface CollegeHeaderProps {
  college: any;
}

function StatCard({ label, value, highlight = false }: { label: string, value: React.ReactNode, highlight?: boolean }) {
  return (
    <div className="bg-background rounded-lg border border-border p-4 shadow-sm flex flex-col">
      <span className="text-sm text-muted-foreground font-medium mb-1">{label}</span>
      <span className={`text-xl font-bold ${highlight ? 'text-success' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}

export function CollegeHeader({ college }: CollegeHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{college.name}</h1>
            <Badge variant={college.type === 'GOVERNMENT' ? 'success' : 'default'} className="mt-1">
              {college.type === 'GOVERNMENT' ? 'Govt' : 'Private'}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            {college.city}, {college.state}
            <span className="text-border">•</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <span className="text-amber-500">★</span> {college.rating.toFixed(1)}
            </span>
            <span className="text-sm">({college.totalReviewCount} reviews)</span>
          </p>
        </div>
        
        <div className="shrink-0 pt-2">
          <CompareActionClient slug={college.slug} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <StatCard label="Annual Fees" value={formatCurrency(college.annualFees)} />
        <StatCard label="Average Placement" value={formatCurrency(college.avgPlacement)} highlight />
        <StatCard label="Highest Placement" value={formatCurrency(college.highestPlacement)} />
        <StatCard label="Placement Rate" value={college.placementPercent ? `${college.placementPercent}%` : 'Not available'} />
      </div>
    </div>
  );
}
