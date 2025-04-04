'use client';

import React, { useEffect, useState } from 'react';

export default function OrientationLock() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    // Function to check if device is in landscape mode
    const checkOrientation = () => {
      if (window.innerWidth <= 767 && window.innerWidth > window.innerHeight) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    // Run on mount and on resize/orientation change
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Lock screen programmatically if supported
    if ('orientation' in screen && typeof (screen as any).orientation?.lock === 'function') {
      try {
        (screen as any).orientation.lock('portrait').catch(() => {
          // Lock failed, fallback to overlay
        });
      } catch {
        // Browser doesn't support orientation locking
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // If not in landscape or not on mobile, don't render anything
  if (!isLandscape) {
    return null;
  }

  // Return overlay that blocks interaction when in landscape
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex flex-col items-center justify-center transform rotate-90 overflow-hidden">
      <div className="flex flex-col items-center -mt-8 px-6">
        <div className="w-16 h-16 mb-4 animate-pulse">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17L15 12L10 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold mb-2">Please Rotate Your Device</h2>
        <p className="text-white/80 text-center text-sm rotate-90">
          This application is designed for portrait mode only
        </p>
      </div>
    </div>
  );
} 