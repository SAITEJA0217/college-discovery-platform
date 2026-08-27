import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CollegeHeader } from '@/components/college/detail/CollegeHeader';
import { CourseTable } from '@/components/college/detail/CourseTable';
import { PlacementTable } from '@/components/college/detail/PlacementTable';
import { CutoffTable } from '@/components/college/detail/CutoffTable';
import { ReviewList } from '@/components/college/detail/ReviewList';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArrowLeft, MapPin } from 'lucide-react';

// Fetch helper using the environment's absolute URL for SSR
async function getCollege(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/colleges/${slug}`, { 
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch college');
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch college ${slug}:`, error);
    throw error;
  }
}

// Dynamically generate SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const college = await getCollege(params.slug);
    
    if (!college) {
      return { title: 'College Not Found | College Discovery' };
    }
    
    return {
      title: `${college.name} — College Details | College Discovery`,
      description: `Explore courses, historical placements, cutoffs, and reviews for ${college.name} located in ${college.city}, ${college.state}.`,
    };
  } catch (e) {
    return { title: 'College | College Discovery' };
  }
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  let college;
  
  try {
    college = await getCollege(params.slug);
  } catch (error) {
    return (
      <Container className="py-20">
        <ErrorState 
          title="Unable to load college details" 
          description="We encountered a problem while fetching this college's information. Please try refreshing the page."
        />
      </Container>
    );
  }

  // Trigger Next.js 404 page
  if (!college) {
    notFound();
  }

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-140px)] pb-24">
      <Container className="py-8">
        
        {/* Breadcrumb / Back Navigation */}
        <nav className="mb-6">
          <Link 
            href="/colleges" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </nav>

        <CollegeHeader college={college} />
        
        <div className="mt-12 space-y-16">
          
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Overview</h2>
            <div className="bg-background rounded-lg border border-border p-6 shadow-sm">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-lg">
                {college.description || "No overview available."}
              </p>
              
              {college.locationInfo && (
                <div className="mt-6 flex items-start gap-3 pt-6 border-t border-border">
                  <MapPin className="text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{college.locationInfo}</p>
                </div>
              )}
            </div>
          </section>

          {/* Courses Section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Courses Offered</h2>
            <CourseTable courses={college.courses} />
          </section>

          {/* Placements Section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Placement History</h2>
            <PlacementTable placements={college.placements} />
          </section>

          {/* Cutoffs Section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Historical Cutoffs</h2>
            <CutoffTable cutoffs={college.cutoffs} />
          </section>

          {/* Reviews Section */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Student Reviews</h2>
            <ReviewList reviews={college.reviews} />
          </section>

        </div>
      </Container>
    </div>
  );
}
