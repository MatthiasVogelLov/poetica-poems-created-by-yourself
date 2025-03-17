
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as statsService from '@/services/stats-service';

interface UsePoemCountsProps {
  startDate?: Date;
  endDate?: Date;
}

export const usePoemCounts = ({ startDate, endDate }: UsePoemCountsProps = {}) => {
  const [totalPoems, setTotalPoems] = useState<number>(0);
  const [todayPoems, setTodayPoems] = useState<number>(0);
  const [keywordsUsed, setKeywordsUsed] = useState<number>(0);
  const [keywordsTodayUsed, setKeywordsTodayUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Prepare date filters
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const todayISOString = today.toISOString();
      
      // For filtered queries
      let startDateFilter = startDate ? startDate.toISOString() : null;
      let endDateFilter = endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : null;
      
      // Fetch all stats in parallel
      const [
        totalPoemsCount,
        todayPoemsCount,
        keywordsUsedCount,
        keywordsTodayUsedCount
      ] = await Promise.all([
        statsService.fetchTotalPoems(startDateFilter, endDateFilter),
        statsService.fetchTodayPoems(todayISOString),
        statsService.fetchKeywordsStats(startDateFilter, endDateFilter),
        statsService.fetchKeywordsTodayStats(todayISOString)
      ]);

      setTotalPoems(totalPoemsCount);
      setTodayPoems(todayPoemsCount);
      setKeywordsUsed(keywordsUsedCount);
      setKeywordsTodayUsed(keywordsTodayUsedCount);
      
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to fetch poem counts:", err);
      setError(err.message);
      setLoading(false);
      
      toast({
        title: "Fehler beim Laden der Gedicht-Zahlen",
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
  }, [startDate, endDate]);

  return { 
    totalPoems, 
    todayPoems, 
    keywordsUsed, 
    keywordsTodayUsed, 
    loading, 
    error, 
    refreshStats: fetchStats 
  };
};
