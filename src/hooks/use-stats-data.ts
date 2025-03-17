
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StatsData, UseStatsDataProps } from '@/types/stats';
import * as statsService from '@/services/stats-service';

export { type StatItem } from '@/types/stats';
export { type StatsData } from '@/types/stats';

const emptyStatsData: StatsData = {
  totalPoems: 0,
  todayPoems: 0,
  keywordsUsed: 0,
  keywordsTodayUsed: 0,
  audienceData: [],
  occasionData: [],
  styleData: [],
  lengthData: [],
  featureData: [],
};

export const useStatsData = ({ startDate, endDate }: UseStatsDataProps = {}) => {
  const [stats, setStats] = useState<StatsData>(emptyStatsData);
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
        totalPoems,
        todayPoems,
        keywordsUsed,
        keywordsTodayUsed,
        audienceData,
        occasionData,
        styleData,
        lengthData,
        featureData
      ] = await Promise.all([
        statsService.fetchTotalPoems(startDateFilter, endDateFilter),
        statsService.fetchTodayPoems(todayISOString),
        statsService.fetchKeywordsStats(startDateFilter, endDateFilter),
        statsService.fetchKeywordsTodayStats(todayISOString),
        statsService.fetchAudienceStats(),
        statsService.fetchOccasionStats(),
        statsService.fetchStyleStats(),
        statsService.fetchLengthStats(),
        statsService.fetchFeatureStats()
      ]);

      setStats({
        totalPoems,
        todayPoems,
        keywordsUsed,
        keywordsTodayUsed,
        audienceData,
        occasionData,
        styleData,
        lengthData,
        featureData
      });
      
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to fetch statistics:", err);
      setError(err.message);
      setLoading(false);
      
      toast({
        title: "Fehler beim Laden der Statistiken",
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

  return { stats, loading, error, refreshStats: fetchStats };
};
