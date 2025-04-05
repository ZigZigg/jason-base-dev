'use client';

import { useEffect } from 'react';
import { useOrientation } from '../providers/OrientationProvider';

/**
 * A hook to handle orientation changes in components.
 * You can use this to implement component-specific behavior when orientation changes.
 * 
 * @param onOrientationChange Optional callback function when orientation changes
 * @returns The current orientation state (isLandscape, isPortrait, isMobile)
 */
export function useOrientationHandler(
  onOrientationChange?: (state: { isLandscape: boolean; isPortrait: boolean; isMobile: boolean }) => void
) {
  const orientation = useOrientation();
  
  useEffect(() => {
    // Call the callback whenever orientation changes
    if (onOrientationChange) {
      onOrientationChange(orientation);
    }
    
    // Example of component-specific handling for landscape mode
    if (orientation.isLandscape && orientation.isMobile) {
      // You could do component-specific handling here:
      // - Adjust layout
      // - Pause video or animations
      // - Save user input
      // - etc.
      
      console.log('Component detected landscape mode on mobile');
    }
  }, [orientation, onOrientationChange]);
  
  return orientation;
} 