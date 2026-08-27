'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface FilterState {
  search: string;
  state: string;
  city: string;
  minFees: string;
  maxFees: string;
  minRating: string;
  sort: string;
}

interface CollegeFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

export function CollegeFilters({ filters, onFilterChange, onClearFilters }: CollegeFiltersProps) {
  
  const sortOptions = [
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'rating-asc', label: 'Lowest Rated' },
    { value: 'fees-asc', label: 'Lowest Fees' },
    { value: 'fees-desc', label: 'Highest Fees' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
  ];

  return (
    <div className="bg-background rounded-lg border border-border p-5 space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs h-8 px-2 text-muted-foreground">
          Clear All
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Sort (Mobile friendly duplication or main sort if sidebar) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Sort By</label>
          <Select 
            value={filters.sort || 'rating-desc'} 
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">State</label>
          <Input 
            placeholder="e.g. Maharashtra" 
            value={filters.state} 
            onChange={(e) => onFilterChange('state', e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">City</label>
          <Input 
            placeholder="e.g. Mumbai" 
            value={filters.city} 
            onChange={(e) => onFilterChange('city', e.target.value)}
          />
        </div>

        <div className="space-y-1.5 pt-2 border-t border-border">
          <label className="text-sm font-medium text-foreground">Minimum Rating</label>
          <Select 
            value={filters.minRating} 
            onChange={(e) => onFilterChange('minRating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5 & Above</option>
            <option value="4.0">4.0 & Above</option>
            <option value="3.5">3.5 & Above</option>
            <option value="3.0">3.0 & Above</option>
          </Select>
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <label className="text-sm font-medium text-foreground">Annual Fees (₹)</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input 
                type="number" 
                placeholder="Min" 
                value={filters.minFees}
                onChange={(e) => onFilterChange('minFees', e.target.value)}
                min="0"
                step="50000"
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="flex-1">
              <Input 
                type="number" 
                placeholder="Max" 
                value={filters.maxFees}
                onChange={(e) => onFilterChange('maxFees', e.target.value)}
                min="0"
                step="50000"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
