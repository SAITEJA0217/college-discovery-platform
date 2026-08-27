import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  totalReviewCount: number;
  annualFees: string;
  avgPlacement: string;
  highestPlacement: string;
  placementPercent: number;
}

interface CollegeCardProps {
  college: College;
  isSelectedForCompare: boolean;
  onToggleCompare: (slug: string) => void;
  canCompareMore: boolean;
}

export function CollegeCard({ college, isSelectedForCompare, onToggleCompare, canCompareMore }: CollegeCardProps) {
  
  const formatCurrency = (value: string) => {
    if (!value || value === "0") return "N/A";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link href={`/colleges/${college.slug}`} className="hover:underline">
              <h3 className="font-semibold text-lg text-primary line-clamp-2">{college.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {college.city}, {college.state}
            </p>
          </div>
          <Badge variant={college.type === 'GOVERNMENT' ? 'success' : 'default'} className="shrink-0">
            {college.type === 'GOVERNMENT' ? 'Govt' : 'Private'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">
            ★ {college.rating.toFixed(1)}
          </div>
          <span className="text-xs text-muted-foreground">({college.totalReviewCount} reviews)</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-4">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Annual Fees</p>
            <p className="font-medium">{formatCurrency(college.annualFees)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Avg Placement</p>
            <p className="font-medium text-success">{formatCurrency(college.avgPlacement)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Highest Placement</p>
            <p className="font-medium">{formatCurrency(college.highestPlacement)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Placement Rate</p>
            <p className="font-medium">{college.placementPercent}%</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 pb-6 gap-3 mt-auto">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onToggleCompare(college.slug)}
          disabled={!isSelectedForCompare && !canCompareMore}
        >
          {isSelectedForCompare ? 'Remove' : 'Compare'}
        </Button>
        <Link href={`/colleges/${college.slug}`} className="flex-1 block">
          <Button variant="primary" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
