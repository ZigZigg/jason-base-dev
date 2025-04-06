'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface OrientationContextType {
  isLandscape: boolean;
  isPortrait: boolean;
  isMobile: boolean;
}

const DEFAULT_CONTEXT: OrientationContextType = {
  isLandscape: false,
  isPortrait: true,
  isMobile: false,
};

const OrientationContext = createContext<OrientationContextType>(DEFAULT_CONTEXT);

export const useOrientation = () => useContext(OrientationContext);

export const OrientationProvider = ({ children }: { children: ReactNode }) => {
  const [orientation, setOrientation] = useState<OrientationContextType>(DEFAULT_CONTEXT);

  useEffect(() => {
    // Function to check device orientation and update context
    const updateOrientation = () => {
      const isMobileDevice = window.innerWidth <= 768;
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      
      setOrientation({
        isLandscape: isLandscapeMode,
        isPortrait: !isLandscapeMode,
        isMobile: isMobileDevice,
      });
    };

    // Check orientation on initial render
    updateOrientation();

    // Add event listeners for orientation/resize changes
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    // Attempt to lock orientation if supported by browser
    if ('orientation' in screen && typeof (screen as any).orientation?.lock === 'function') {
      try {
        (screen as any).orientation.lock('portrait').catch(() => {
          // Silently fail if lock is not supported or denied
          console.log('Failed to lock screen orientation');
        });
      } catch {
        // Browser doesn't support the API
        console.log('Screen orientation API not supported');
      }
    }

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);


  return (
    <OrientationContext.Provider value={orientation}>
      {children}
    </OrientationContext.Provider>
  );
}; 