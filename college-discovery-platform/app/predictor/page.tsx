import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { PredictorForm } from '@/components/predictor/PredictorForm';
import { AlertTriangle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'College Predictor | College Discovery',
  description: 'Find potential colleges using historical admission cutoff data.',
};

export default function PredictorPage() {
  return (
    <div className="bg-muted/30 min-h-[calc(100vh-140px)] pb-24 pt-12">
      <Container>
        
        {/* Hero Section */}
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Find Colleges That Match Your Rank
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore potential colleges using historical admission cutoff data.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Form & Results (Left / Main) */}
          <div className="flex-1 w-full max-w-4xl">
            <PredictorForm />
          </div>

          {/* Educational Sidebar (Right) */}
          <aside className="w-full lg:w-[350px] shrink-0 space-y-6">
            
            <div className="bg-background rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-foreground">
                <HelpCircle className="text-primary h-5 w-5" />
                <h3 className="font-bold text-lg">How it works</h3>
              </div>
              <ol className="space-y-4 text-sm text-muted-foreground list-decimal list-inside">
                <li>You enter your exam, category, and rank.</li>
                <li>We check historical cutoff records in our database.</li>
                <li>Colleges with historical closing ranks at or above your rank are shown.</li>
                <li>Results are ordered by the closest historical cutoff.</li>
              </ol>
            </div>

            <div className="bg-warning/10 rounded-lg border border-warning/20 p-6 shadow-sm">
              <div className="flex gap-3 text-warning-foreground items-start">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-warning" />
                <p className="text-sm font-medium leading-relaxed">
                  <strong className="block mb-1">Important</strong>
                  These results are based on historical cutoff data and do not guarantee admission. Cutoffs can change between admission years and should be used as a reference only.
                </p>
              </div>
            </div>

          </aside>
        </div>

      </Container>
    </div>
  );
}
