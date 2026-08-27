'use client';

import { useState, useEffect, useCallback } from 'react';

const COMPARE_KEY = 'college_discovery_compare';

export function useCompareState() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      if (stored) {
        setSelectedSlugs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load compare state from local storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to local storage on change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(selectedSlugs));
        
        // Dispatch custom event to notify other components/tabs
        window.dispatchEvent(new Event('compare-state-changed'));
      } catch (e) {
        console.error("Failed to save compare state to local storage", e);
      }
    }
  }, [selectedSlugs, isInitialized]);

  // Listen for changes from other tabs or components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(COMPARE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Only update if actually different to prevent infinite loops
          if (JSON.stringify(parsed) !== JSON.stringify(selectedSlugs)) {
            setSelectedSlugs(parsed);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('compare-state-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('compare-state-changed', handleStorageChange);
    };
  }, [selectedSlugs]);

  const toggleCompare = useCallback((slug: string) => {
    setSelectedSlugs(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedSlugs([]);
  }, []);

  return {
    selectedSlugs,
    toggleCompare,
    clearCompare,
    canCompareMore: selectedSlugs.length < 3,
    isInitialized
  };
}
