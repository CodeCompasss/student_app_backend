'use client';

import { useEffect } from 'react';
// import { startCleanupScheduler } from '@/lib/cleanup';

export function CleanupInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only run on client side
      // startCleanupScheduler();
    }
    
    return () => {
      // Clean up if needed
    };
  }, []);

  return null; // This component doesn't render anything
}
