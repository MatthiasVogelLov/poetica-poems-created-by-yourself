
import { useState, useEffect } from 'react';
import { UseStatsDataProps } from '@/types/stats';
import {
  fetchTotalPoems,
  fetchTodayPoems,
  fetchKeywordsStats,
  fetchKeywordsTodayStats,
  fetchUnpaidPoemsCount
} from '@/services/stats-service';

export function usePoemCounts({ startDate, endDate }: UseStatsDataProps = {}) {
  const [totalPoems, setTotalPoems] = useState<number>(0);
  const [todayPoems, setTodayPoems] = useState<number>(0);
  const [keywordsUsed, setKeywordsUsed] = useState<number>(0);
  const [keywordsTodayUsed, setKeywordsTodayUsed] = useState<number>(0);
  const [unpaidPoems, setUnpaidPoems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Convert dates to ISO strings for API calls
        const startDateStr = startDate ? startDate.toISOString() : null;
        const endDateStr = endDate ? endDate.toISOString() : null;
        
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISOString = today.toISOString();
        
        // Fetch stats in parallel
        const [
          totalPoemsData,
          todayPoemsData,
          keywordsUsedData,
          keywordsTodayUsedData,
          unpaidPoemsData
        ] = await Promise.all([
          fetchTotalPoems(startDateStr, endDateStr),
          fetchTodayPoems(todayISOString),
          fetchKeywordsStats(startDateStr, endDateStr),
          fetchKeywordsTodayStats(todayISOString),
          fetchUnpaidPoemsCount()
        ]);
        
        setTotalPoems(totalPoemsData);
        setTodayPoems(todayPoemsData);
        setKeywordsUsed(keywordsUsedData);
        setKeywordsTodayUsed(keywordsTodayUsedData);
        setUnpaidPoems(unpaidPoemsData);
      } catch (err) {
        console.error('Error fetching poem counts:', err);
        setError('Error fetching poem counts: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [startDate, endDate]);

  return {
    totalPoems,
    todayPoems,
    keywordsUsed,
    keywordsTodayUsed,
    unpaidPoems,
    loading,
    error
  };
}
