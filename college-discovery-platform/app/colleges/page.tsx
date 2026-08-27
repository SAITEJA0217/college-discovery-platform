'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { CollegeCard } from '@/components/college/CollegeCard';
import { CollegeFilters } from '@/components/college/CollegeFilters';
import { CollegePagination } from '@/components/college/CollegePagination';
import { CompareSelectionBar } from '@/components/college/CompareSelectionBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Search, Filter, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useCompareState } from '@/lib/hooks/useCompareState';

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

interface Meta {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

function CollegesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State mapped to local state for immediate UI response
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    city: searchParams.get('city') || '',
    minFees: searchParams.get('minFees') || '',
    maxFees: searchParams.get('maxFees') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'rating-desc',
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const limit = 10;

  // Debounced search for API calls
  const debouncedSearch = useDebounce(filters.search, 400);

  // Data fetching state
  const [colleges, setColleges] = useState<College[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Compare state from shared hook
  const { selectedSlugs, toggleCompare, clearCompare, canCompareMore, isInitialized } = useCompareState();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state to URL and fetch data
  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (filters.state) params.set('state', filters.state);
        if (filters.city) params.set('city', filters.city);
        if (filters.minFees) params.set('minFees', filters.minFees);
        if (filters.maxFees) params.set('maxFees', filters.maxFees);
        if (filters.minRating) params.set('minRating', filters.minRating);
        if (filters.sort) params.set('sort', filters.sort);
        if (page > 1) params.set('page', page.toString());
        params.set('limit', limit.toString());

        // Update URL without full page reload
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        const res = await fetch(`/api/colleges?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        setColleges(data.data);
        setMeta(data.meta);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, [debouncedSearch, filters.state, filters.city, filters.minFees, filters.maxFees, filters.minRating, filters.sort, page, pathname, router]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      state: '',
      city: '',
      minFees: '',
      maxFees: '',
      minRating: '',
      sort: 'rating-desc',
    });
    setPage(1);
  };

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-140px)] pb-24">
      {/* Header section */}
      <div className="bg-background border-b border-border pb-8 pt-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Explore Colleges</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Search and compare institutions using fees, ratings, location, and placement data.
            </p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 text-base" 
                placeholder="Search colleges by name or location..." 
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <Button 
              className="sm:hidden h-12" 
              variant="outline" 
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <CollegeFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClearFilters={clearFilters} 
              />
            </div>
          </aside>

          {/* Main Results Area */}
          <main className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {isLoading ? 'Searching...' : `${meta?.count || 0} Colleges Found`}
              </h2>
            </div>

            {error ? (
              <ErrorState 
                title="Unable to load colleges" 
                retryAction={() => handleFilterChange('search', filters.search)} 
              />
            ) : isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <EmptyState 
                title="No colleges found" 
                description="We couldn't find any colleges matching your current filters."
                action={<Button onClick={clearFilters}>Clear Filters</Button>}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard 
                      key={college.id} 
                      college={college} 
                      isSelectedForCompare={selectedSlugs.includes(college.slug)}
                      onToggleCompare={toggleCompare}
                      canCompareMore={canCompareMore}
                    />
                  ))}
                </div>
                
                {meta && (
                  <CollegePagination 
                    currentPage={page} 
                    limit={limit} 
                    totalCount={meta.count} 
                    onPageChange={setPage} 
                  />
                )}
              </>
            )}
          </main>
        </div>
      </Container>

      {/* Compare Bar */}
      {isInitialized && (
        <CompareSelectionBar 
          selectedSlugs={selectedSlugs} 
          onRemove={toggleCompare} 
          onClear={clearCompare} 
        />
      )}

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileFiltersOpen(false)} className="px-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <CollegeFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClearFilters={clearFilters} 
            />
            <Button className="w-full mt-6" onClick={() => setIsMobileFiltersOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CollegesPageContent />
    </Suspense>
  );
}
