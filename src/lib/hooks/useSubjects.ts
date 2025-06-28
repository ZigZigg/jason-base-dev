import { useEffect, useState } from "react";
import { clientFetch } from "./useClientApi";

export interface Subject {
    id: number;
    name: string;
    is_top_level: boolean;
  }
  
  
  // Hook for fetching subjects
  export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
      let isMounted = true;
      
      const fetchSubjects = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Use our internal API route instead of calling the external API directly
          const data = await clientFetch<Subject[]>('/api/subjects');
          
          if (isMounted) {
            setSubjects(data);
          }
        } catch (err) {
          if (isMounted) {
            setError(err instanceof Error ? err : new Error('Failed to fetch subjects'));
          }
          console.error('Error fetching subjects:', err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      
      fetchSubjects();
      
      return () => {
        isMounted = false;
      };
    }, []);
    
    return { subjects, isLoading, error };
  } 