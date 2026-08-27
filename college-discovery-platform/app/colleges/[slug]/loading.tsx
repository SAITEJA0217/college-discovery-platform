import { Container } from '@/components/layout/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="bg-muted/30 min-h-[calc(100vh-140px)] py-8">
      <Container>
        <Skeleton className="h-6 w-32 mb-8" />
        
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-12 w-96 mb-4" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        
        <div className="space-y-4 mb-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
        
        <div className="space-y-4 mb-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Container>
    </div>
  );
}
