import { useState, useEffect } from 'react';
import { clientFetch } from './useClientApi';

// Types for the API responses
export interface Grade {
    id: number;
    name: string;
    sort_order: number;
  }

// Hook for fetching grades
export function useGrades() {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
      let isMounted = true;
      
      const fetchGrades = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Use our internal API route instead of calling the external API directly
          const data = await clientFetch<Grade[]>('/api/grades');
          
          if (isMounted) {
            setGrades(data);
          }
        } catch (err) {
          if (isMounted) {
            setError(err instanceof Error ? err : new Error('Failed to fetch grades'));
          }
          console.error('Error fetching grades:', err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      
      fetchGrades();
      
      return () => {
        isMounted = false;
      };
    }, []);
    
    return { grades, isLoading, error };
  }