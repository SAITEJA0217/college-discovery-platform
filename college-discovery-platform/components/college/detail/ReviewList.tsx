import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export function ReviewList({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState 
        title="No reviews yet" 
        description="Be the first to review this institution."
        icon={<MessageSquare className="h-10 w-10 text-muted-foreground" />}
      />
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-background rounded-lg border border-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{review.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span className="font-medium text-foreground">{review.reviewerName || 'Anonymous'}</span>
                <span className="text-border">•</span>
                <span>{formatDate(review.createdAt)}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold shrink-0">
              <span>★</span> {review.rating.toFixed(1)}
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-line">
            {review.comment}
          </div>
        </div>
      ))}
    </div>
  );
}
