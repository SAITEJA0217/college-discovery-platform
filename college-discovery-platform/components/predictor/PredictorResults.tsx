import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, TrendingUp, MapPin, Building } from 'lucide-react';

interface PredictorResultsProps {
  results: any[];
  userRank: number;
}

export function PredictorResults({ results, userRank }: PredictorResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Potential Historical Matches</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, idx) => (
          <div key={`${result.college.slug}-${idx}`} className="bg-background rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1 leading-tight">{result.college.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm gap-2 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {result.college.city}, {result.college.state}</span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1"><Building size={14} /> {result.college.type === 'GOVERNMENT' ? 'Govt' : 'Private'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-bold shrink-0">
                  <span>★</span> {result.college.rating.toFixed(1)}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4 border border-border">
                <div className="text-sm text-foreground font-medium mb-3 pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Matching Course:</span> {result.course.name}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Your Rank</span>
                    <span className="text-lg font-bold text-foreground">{userRank}</span>
                  </div>
                  <CheckCircle2 className="text-success h-6 w-6 opacity-50" />
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Historical Cutoff</span>
                    <span className="text-lg font-bold text-success">{result.closingRank}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground text-center italic">
                  *Based on {result.admissionYear} admission data
                </div>
              </div>

              <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">Annual Fees</span>
                  <span className="font-semibold">{formatCurrency(result.college.annualFees)}</span>
                </div>
                <Link href={`/colleges/${result.college.slug}`}>
                  <Button variant="outline" size="sm">View College</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
