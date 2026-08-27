import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link href="/" className="text-lg font-bold text-primary">
              College Discovery
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Data-driven decisions for your future.
            </p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {currentYear} College Discovery Platform. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
