'use client';

import { useOrientation } from '@/app/providers/OrientationProvider';

// This component is now simpler as it uses the orientation context
export default function OrientationLock() {
  const { isLandscape } = useOrientation();
  
  // If not in landscape, don't render anything
  if (!isLandscape) {
    return null;
  }

  // The main warning UI is now handled by the OrientationProvider
  // This is just a backup in case you want to add specific behavior in certain components
  return null;
} 