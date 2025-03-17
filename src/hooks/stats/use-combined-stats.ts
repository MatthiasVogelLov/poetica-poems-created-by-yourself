
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StatsData, UseStatsDataProps } from '@/types/stats';
import { usePoemCounts } from './use-poem-counts';
import { useAudienceStats } from './use-audience-stats';
import { useOccasionStats } from './use-occasion-stats';
import { useStyleStats } from './use-style-stats';
import { useLengthStats } from './use-length-stats';
import { useFeatureStats } from './use-feature-stats';

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

export const useCombinedStats = ({ startDate, endDate }: UseStatsDataProps = {}) => {
  const [stats, setStats] = useState<StatsData>(emptyStatsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use individual hooks
  const { 
    totalPoems, 
    todayPoems, 
    keywordsUsed, 
    keywordsTodayUsed, 
    loading: poemCountsLoading, 
    error: poemCountsError 
  } = usePoemCounts({ startDate, endDate });
  
  const { audienceData, loading: audienceLoading, error: audienceError } = useAudienceStats();
  const { occasionData, loading: occasionLoading, error: occasionError } = useOccasionStats();
  const { styleData, loading: styleLoading, error: styleError } = useStyleStats();
  const { lengthData, loading: lengthLoading, error: lengthError } = useLengthStats();
  const { featureData, loading: featureLoading, error: featureError } = useFeatureStats();
  
  // Combine all stats into a single object
  useEffect(() => {
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
    
    // Check if all data is loaded
    const isLoading = poemCountsLoading || 
                     audienceLoading || 
                     occasionLoading || 
                     styleLoading || 
                     lengthLoading || 
                     featureLoading;
    
    setLoading(isLoading);
    
    // Check for any errors
    const anyError = poemCountsError || 
                    audienceError || 
                    occasionError || 
                    styleError || 
                    lengthError || 
                    featureError;
    
    if (anyError) {
      setError(anyError);
      
      toast({
        title: "Fehler beim Laden der Statistiken",
        description: anyError,
        variant: "destructive",
      });
    } else {
      setError(null);
    }
  }, [
    totalPoems, 
    todayPoems, 
    keywordsUsed, 
    keywordsTodayUsed,
    audienceData, 
    occasionData, 
    styleData, 
    lengthData, 
    featureData,
    poemCountsLoading,
    audienceLoading,
    occasionLoading,
    styleLoading,
    lengthLoading,
    featureLoading
  ]);

  return { stats, loading, error };
};
