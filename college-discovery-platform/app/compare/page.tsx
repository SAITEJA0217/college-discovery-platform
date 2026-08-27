import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ComparisonTable } from '@/components/compare/ComparisonTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Colleges | College Discovery',
  description: 'Compare college fees, ratings, placement outcomes, and locations.',
};

async function getComparisonData(slugsStr: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/colleges/compare?slugs=${slugsStr}`, { 
    cache: 'no-store' // We want this fresh as users add/remove colleges dynamically
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch comparison data');
  }
  
  return res.json();
}

export default async function ComparePage({ searchParams }: { searchParams: { slugs?: string } }) {
  const slugsParam = searchParams.slugs || '';
  const slugsArray = slugsParam.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-140px)] pb-24 pt-10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Compare Colleges</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              See fees, ratings, placement outcomes, and locations side-by-side.
            </p>
          </div>
          <Link href="/colleges">
            <Button variant="outline">Browse Colleges</Button>
          </Link>
        </div>

        {slugsArray.length === 0 ? (
          <EmptyState 
            title="Choose colleges to compare" 
            description="Select 2–3 colleges from the college directory."
            icon={<Layers className="h-10 w-10 text-muted-foreground" />}
            action={<Link href="/colleges"><Button>Browse Colleges</Button></Link>}
          />
        ) : slugsArray.length === 1 ? (
          <EmptyState 
            title="Select at least 2 colleges to compare." 
            description="You need one more college to perform a side-by-side comparison."
            icon={<Layers className="h-10 w-10 text-muted-foreground" />}
            action={<Link href="/colleges"><Button>Browse Colleges</Button></Link>}
          />
        ) : slugsArray.length > 3 ? (
          <ErrorState 
            title="You can compare up to 3 colleges."
            description="Please remove some colleges to continue."
            retryAction={() => {}}
          />
        ) : (
          <Suspense fallback={
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          }>
            <ComparisonContent slugs={slugsParam} />
          </Suspense>
        )}
      </Container>
    </div>
  );
}

// Separate component for the actual data fetching to trigger Suspense
async function ComparisonContent({ slugs }: { slugs: string }) {
  try {
    const data = await getComparisonData(slugs);
    
    // Sort colleges to match the order of slugs provided in the URL
    const slugOrder = slugs.split(',').map(s => s.trim());
    const sortedColleges = [...data.data].sort((a, b) => {
      return slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug);
    });
    
    return <ComparisonTable colleges={sortedColleges} />;
  } catch (error) {
    return (
      <ErrorState 
        title="One or more colleges could not be found." 
        description="The colleges you are trying to compare may have been removed."
        retryAction={() => window.location.href = '/colleges'}
      />
    );
  }
}
