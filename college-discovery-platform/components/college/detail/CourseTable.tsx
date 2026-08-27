import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export function CourseTable({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) {
    return (
      <EmptyState 
        title="No courses listed" 
        description="Course information is not available for this institution."
        icon={<BookOpen className="h-10 w-10 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Degree</th>
              <th className="px-6 py-4">Course Name</th>
              <th className="px-6 py-4 whitespace-nowrap">Duration</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Annual Fees</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{course.degree}</td>
                <td className="px-6 py-4">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.durationYears} Years</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  {formatCurrency(course.annualFees)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
