'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from 'antd';

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Start/Reset loading progress
  const startLoading = () => {
    setIsLoading(true);
    setProgress(20);
    const timer1 = setTimeout(() => {
      setProgress(40);
      const timer2 = setTimeout(() => {
        setProgress(60);
        const timer3 = setTimeout(() => {
          setProgress(80);
        }, 200);
        return () => clearTimeout(timer3);
      }, 300);
      return () => clearTimeout(timer2);
    }, 200);
    return () => clearTimeout(timer1);
  };

  // Complete loading animation
  const completeLoading = () => {
    setProgress(100);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Keep progress bar visible for a moment at 100%
    return () => clearTimeout(timer);
  };

  // Track navigation events manually
  useEffect(() => {
    let mounted = true;

    // Handle navigation start
    const handleNavigationStart = () => {
      if (mounted) startLoading();
    };

    // Handle navigation complete
    const handleNavigationComplete = () => {
      if (mounted) completeLoading();
    };

    // Set up navigation change detection
    let lastPathname = pathname;
    let lastSearchParams = searchParams.toString();
    
    const checkNavigation = () => {
      const currentPathname = window.location.pathname;
      const currentSearchParams = window.location.search.substring(1);
      
      if (currentPathname !== lastPathname || currentSearchParams !== lastSearchParams) {
        lastPathname = currentPathname;
        lastSearchParams = currentSearchParams;
        handleNavigationStart();
        
        // Simulate navigation completion
        setTimeout(handleNavigationComplete, 500);
      }
    };

    // Poll for changes
    const interval = setInterval(checkNavigation, 100);

    // Capture link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && 
          link.href && 
          link.target !== '_blank' && 
          link.origin === window.location.origin) {
        handleNavigationStart();
      }
    };

    // Handle browser back/forward
    const handlePopState = () => {
      handleNavigationStart();
    };

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);

    // Simulate initial page load
    handleNavigationStart();
    setTimeout(handleNavigationComplete, 500);

    return () => {
      mounted = false;
      clearInterval(interval);
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // Reset loading state when route changes
  useEffect(() => {
    completeLoading();
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {isLoading && (
        <div className="fixed top-[-10px] left-0 w-full z-50">
          <Progress 
            percent={progress} 
            showInfo={false} 
            strokeLinecap="round" 
            strokeColor="rgb(228, 154, 41)" 
            trailColor="transparent"

            className="m-0"
          />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
} 