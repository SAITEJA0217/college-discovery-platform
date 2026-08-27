'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useCompareState } from '@/lib/hooks/useCompareState';
import { X } from 'lucide-react';

interface ComparisonTableProps {
  colleges: any[];
}

export function ComparisonTable({ colleges }: ComparisonTableProps) {
  const router = useRouter();
  const { toggleCompare } = useCompareState();

  const handleRemove = (slug: string) => {
    // Update local storage so it reflects elsewhere
    toggleCompare(slug);
    
    // Update current URL to re-fetch Server Component
    const newSlugs = colleges.filter(c => c.slug !== slug).map(c => c.slug);
    if (newSlugs.length > 0) {
      router.push(`/compare?slugs=${newSlugs.join(',')}`);
    } else {
      router.push('/compare');
    }
  };

  // Helper to find min/max for highlighting
  const getHighlights = (metric: string, type: 'max' | 'min') => {
    const validValues = colleges
      .map(c => c[metric])
      .filter(v => v !== null && v !== undefined && v !== '');

    if (validValues.length === 0) return null;

    const numericValues = validValues.map(v => typeof v === 'string' ? parseFloat(v) : v);
    
    // Check if any NaN
    if (numericValues.some(isNaN)) return null;

    const targetValue = type === 'max' ? Math.max(...numericValues) : Math.min(...numericValues);
    
    // Identify which colleges match this target value
    return colleges.map(c => {
      const val = typeof c[metric] === 'string' ? parseFloat(c[metric]) : c[metric];
      return val === targetValue;
    });
  };

  const highestRatings = getHighlights('rating', 'max');
  const lowestFees = getHighlights('annualFees', 'min');
  const highestAvgPlacement = getHighlights('avgPlacement', 'max');
  const highestMaxPlacement = getHighlights('highestPlacement', 'max');
  const highestPlacementPercent = getHighlights('placementPercent', 'max');

  const renderCell = (
    college: any, 
    index: number, 
    metric: string, 
    formatter?: (val: any) => string, 
    highlights?: boolean[] | null, 
    highlightLabel?: string
  ) => {
    const value = college[metric];
    const isHighlighted = highlights ? highlights[index] : false;
    
    const displayValue = formatter ? formatter(value) : (value || 'Not available');

    return (
      <td key={college.id} className={`px-6 py-4 whitespace-nowrap border-b border-border min-w-[250px] ${isHighlighted ? 'bg-success/5' : ''}`}>
        <div className="flex flex-col">
          <span className={`text-base ${isHighlighted ? 'font-bold text-success' : 'text-foreground'}`}>
            {displayValue}
          </span>
          {isHighlighted && highlightLabel && (
            <span className="text-xs text-success font-medium mt-1 uppercase tracking-wider">{highlightLabel}</span>
          )}
        </div>
      </td>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {/* Sticky Header Column */}
            <th className="px-6 py-6 border-b border-border bg-muted text-muted-foreground font-semibold sticky left-0 z-20 min-w-[200px] shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none md:border-r">
              Metrics
            </th>
            
            {/* College Columns */}
            {colleges.map(college => (
              <th key={college.id} className="px-6 py-6 border-b border-border bg-background align-top min-w-[250px]">
                <div className="flex flex-col h-full justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1 leading-tight">{college.name}</h2>
                    <p className="text-muted-foreground text-sm">{college.city}, {college.state}</p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/colleges/${college.slug}`} className="flex-1">
                      <Button variant="primary" className="w-full">View Details</Button>
                    </Link>
                    <Button variant="outline" size="icon" onClick={() => handleRemove(college.slug)} aria-label={`Remove ${college.name}`}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Row: Location */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Location
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'city', (val) => `${val}, ${c.state}`))}
          </tr>
          
          {/* Row: Type */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              College Type
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'type', (val) => val === 'GOVERNMENT' ? 'Government' : 'Private'))}
          </tr>

          {/* Row: Rating */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Rating
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'rating', (val) => `${val.toFixed(1)} / 5.0`, highestRatings, 'Highest'))}
          </tr>

          {/* Row: Reviews */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Reviews
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'totalReviewCount', (val) => `${val} student reviews`))}
          </tr>

          {/* Row: Annual Fees */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Annual Fees
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'annualFees', formatCurrency, lowestFees, 'Lower Cost'))}
          </tr>

          {/* Row: Avg Placement */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Average Placement
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'avgPlacement', formatCurrency, highestAvgPlacement, 'Highest'))}
          </tr>

          {/* Row: Highest Placement */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Highest Placement
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'highestPlacement', formatCurrency, highestMaxPlacement, 'Highest'))}
          </tr>

          {/* Row: Placement Percentage */}
          <tr className="hover:bg-muted/30 transition-colors">
            <th className="px-6 py-4 whitespace-nowrap border-b border-border bg-muted font-medium sticky left-0 z-10 md:border-r shadow-[4px_0_12px_rgba(0,0,0,0.05)] md:shadow-none text-muted-foreground">
              Placement Percentage
            </th>
            {colleges.map((c, i) => renderCell(c, i, 'placementPercent', (val) => val ? `${val}%` : 'Not available', highestPlacementPercent, 'Highest'))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
