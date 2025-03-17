
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StatItem } from '@/types/stats';
import * as statsService from '@/services/stats-service';

export const useOccasionStats = () => {
  const [occasionData, setOccasionData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.fetchOccasionStats();
      setOccasionData(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to fetch occasion statistics:", err);
      setError(err.message);
      setLoading(false);
      
      toast({
        title: "Fehler beim Laden der Anlass-Statistiken",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set polling interval
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { occasionData, loading, error, refreshStats: fetchStats };
};
