'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PredictorResults } from './PredictorResults';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const EXAM_OPTIONS = [
  { value: 'JEE_MAIN', label: 'JEE Main' },
  { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
  { value: 'BITSAT', label: 'BITSAT' },
  { value: 'STATE_CET', label: 'State CET' },
  { value: 'CUET', label: 'CUET' },
];

const CATEGORY_OPTIONS = [
  { value: 'GENERAL', label: 'General' },
  { value: 'OBC', label: 'OBC' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
  { value: 'EWS', label: 'EWS' },
];

// Client-side validation schema
const predictorSchema = z.object({
  exam: z.enum(['JEE_MAIN', 'JEE_ADVANCED', 'BITSAT', 'STATE_CET', 'CUET']),
  category: z.enum(['GENERAL', 'OBC', 'SC', 'ST', 'EWS']),
  rank: z.number().int("Rank must be a whole number").positive("Rank must be positive").max(2000000, "Please enter a realistic rank"),
});

export function PredictorForm() {
  const [exam, setExam] = useState(EXAM_OPTIONS[0].value);
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [rankInput, setRankInput] = useState('');
  const [rankError, setRankError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [lastSearchedRank, setLastSearchedRank] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRankError('');
    setError(false);

    // Parse numeric rank
    const numericRank = Number(rankInput);
    
    // Zod Validation
    try {
      predictorSchema.parse({
        exam,
        category,
        rank: numericRank
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Find the rank error specifically since dropdowns are controlled
        const rankIssue = err.issues.find(issue => issue.path[0] === 'rank');
        if (rankIssue) {
          setRankError(rankIssue.message);
        } else {
          setRankError("Invalid input parameters.");
        }
      }
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam,
          category,
          rank: numericRank
        })
      });

      if (!res.ok) {
        throw new Error('Predictor API returned an error');
      }

      const data = await res.json();
      setResults(data.data);
      setLastSearchedRank(numericRank);
    } catch (err) {
      console.error("Predictor fetch failed:", err);
      setError(true);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="bg-background rounded-xl border border-border p-6 shadow-md mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="exam" className="text-sm font-semibold text-foreground">Exam</label>
            <Select 
              id="exam" 
              value={exam} 
              onChange={(e) => setExam(e.target.value)}
              className="h-12"
            >
              {EXAM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-semibold text-foreground">Category</label>
            <Select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="h-12"
            >
              {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="rank" className="text-sm font-semibold text-foreground">Rank</label>
            <div className="relative">
              <Input 
                id="rank" 
                type="number" 
                placeholder="e.g. 1500" 
                value={rankInput}
                onChange={(e) => setRankInput(e.target.value)}
                className={`h-12 ${rankError ? 'border-danger focus-visible:ring-danger' : ''}`}
                aria-invalid={!!rankError}
                aria-describedby={rankError ? "rank-error" : undefined}
              />
            </div>
            {rankError && (
              <span id="rank-error" className="text-sm text-danger flex items-center gap-1 mt-1">
                <AlertCircle size={14} /> {rankError}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading || !rankInput}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isLoading ? 'Finding Matches...' : 'Find Colleges'}
          </Button>
        </div>
      </form>

      {/* Results Area */}
      <div className="min-h-[400px]">
        {error && (
          <ErrorState 
            title="Unable to generate recommendations." 
            description="We encountered an issue checking the historical data. Please try again."
            retryAction={() => setError(false)}
          />
        )}

        {isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {!isLoading && !error && results && results.length === 0 && (
          <EmptyState 
            title="No historical matches found" 
            description="We couldn't find a historical cutoff that matches this rank, exam, and category in the current dataset."
            icon={<Search className="h-10 w-10 text-muted-foreground" />}
            action={<Button variant="outline" onClick={() => setRankInput('')}>Try another rank</Button>}
          />
        )}

        {!isLoading && !error && results && results.length > 0 && lastSearchedRank && (
          <PredictorResults results={results} userRank={lastSearchedRank} />
        )}
      </div>
    </div>
  );
}
