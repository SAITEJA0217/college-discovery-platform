import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-6">
        <MapPin className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">College Not Found</h1>
      <p className="text-muted-foreground max-w-md text-center mb-8">
        We couldn&apos;t find the college you were looking for. It may have been removed, or the URL might be incorrect.
      </p>
      <Link href="/colleges">
        <Button className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Colleges
        </Button>
      </Link>
    </div>
  );
}
