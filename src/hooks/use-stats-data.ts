
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StatItem {
  name: string;
  value: number;
  todayValue: number;
}

export interface StatsData {
  totalPoems: number;
  todayPoems: number;
  keywordsUsed: number;
  keywordsTodayUsed: number;
  audienceData: StatItem[];
  occasionData: StatItem[];
  styleData: StatItem[];
  lengthData: StatItem[];
  featureData: StatItem[];
}

export const useStatsData = () => {
  const [stats, setStats] = useState<StatsData>({
    totalPoems: 0,
    todayPoems: 0,
    keywordsUsed: 0,
    keywordsTodayUsed: 0,
    audienceData: [],
    occasionData: [],
    styleData: [],
    lengthData: [],
    featureData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total poems
      const { data: totalPoemsData, error: totalPoemsError } = await supabase
        .from('poem_stats')
        .select('count');
      
      if (totalPoemsError) throw new Error(totalPoemsError.message);
      
      // Get today's poems
      const { data: todayPoemsData, error: todayPoemsError } = await supabase
        .from('poem_stats')
        .select('count')
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
      
      if (todayPoemsError) throw new Error(todayPoemsError.message);
      
      // Get keywords stats
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('poem_stats')
        .select('count')
        .eq('has_keywords', true);
      
      if (keywordsError) throw new Error(keywordsError.message);
      
      // Get today's keywords
      const { data: keywordsTodayData, error: keywordsTodayError } = await supabase
        .from('poem_stats')
        .select('count')
        .eq('has_keywords', true)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
      
      if (keywordsTodayError) throw new Error(keywordsTodayError.message);
      
      // Get audience stats
      const { data: audienceData, error: audienceError } = await supabase
        .from('audience_stats')
        .select('*');
      
      if (audienceError) throw new Error(audienceError.message);
      
      // Get occasion stats
      const { data: occasionData, error: occasionError } = await supabase
        .from('occasion_stats')
        .select('*');
      
      if (occasionError) throw new Error(occasionError.message);
      
      // Get style stats
      const { data: styleData, error: styleError } = await supabase
        .from('style_stats')
        .select('*');
      
      if (styleError) throw new Error(styleError.message);
      
      // Get length stats
      const { data: lengthData, error: lengthError } = await supabase
        .from('length_stats')
        .select('*');
      
      if (lengthError) throw new Error(lengthError.message);
      
      // Get feature usage stats
      const { data: featureData, error: featureError } = await supabase
        .from('feature_usage_stats')
        .select('*');
      
      if (featureError) throw new Error(featureError.message);

      // Format data for our components - Convert string values to numbers
      const formattedAudienceData = (audienceData || []).map(item => ({
        name: item.audience || 'Unspecified',
        value: typeof item.total === 'string' ? parseInt(item.total) || 0 : item.total || 0,
        todayValue: typeof item.today === 'string' ? parseInt(item.today) || 0 : item.today || 0
      }));
      
      const formattedOccasionData = (occasionData || []).map(item => ({
        name: item.occasion || 'Unspecified',
        value: typeof item.total === 'string' ? parseInt(item.total) || 0 : item.total || 0,
        todayValue: typeof item.today === 'string' ? parseInt(item.today) || 0 : item.today || 0
      }));
      
      const formattedStyleData = (styleData || []).map(item => ({
        name: item.style || 'Unspecified',
        value: typeof item.total === 'string' ? parseInt(item.total) || 0 : item.total || 0,
        todayValue: typeof item.today === 'string' ? parseInt(item.today) || 0 : item.today || 0
      }));
      
      const formattedLengthData = (lengthData || []).map(item => ({
        name: item.length || 'Unspecified',
        value: typeof item.total === 'string' ? parseInt(item.total) || 0 : item.total || 0,
        todayValue: typeof item.today === 'string' ? parseInt(item.today) || 0 : item.today || 0
      }));
      
      const formattedFeatureData = (featureData || []).map(item => ({
        name: item.feature_name || 'Unspecified',
        value: typeof item.total === 'string' ? parseInt(item.total) || 0 : item.total || 0,
        todayValue: typeof item.today === 'string' ? parseInt(item.today) || 0 : item.today || 0
      }));

      // Handle both string and number types from Supabase
      const totalPoems = totalPoemsData?.[0]?.count 
        ? (typeof totalPoemsData[0].count === 'string' 
            ? parseInt(totalPoemsData[0].count) 
            : totalPoemsData[0].count) 
        : 0;
        
      const todayPoems = todayPoemsData?.[0]?.count 
        ? (typeof todayPoemsData[0].count === 'string' 
            ? parseInt(todayPoemsData[0].count) 
            : todayPoemsData[0].count) 
        : 0;
        
      const keywordsUsed = keywordsData?.[0]?.count 
        ? (typeof keywordsData[0].count === 'string' 
            ? parseInt(keywordsData[0].count) 
            : keywordsData[0].count) 
        : 0;
        
      const keywordsTodayUsed = keywordsTodayData?.[0]?.count 
        ? (typeof keywordsTodayData[0].count === 'string' 
            ? parseInt(keywordsTodayData[0].count) 
            : keywordsTodayData[0].count) 
        : 0;

      setStats({
        totalPoems,
        todayPoems,
        keywordsUsed,
        keywordsTodayUsed,
        audienceData: formattedAudienceData,
        occasionData: formattedOccasionData,
        styleData: formattedStyleData,
        lengthData: formattedLengthData,
        featureData: formattedFeatureData
      });
      
      setLoading(false);
    } catch (err) {
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
    
    // Set up polling to refresh stats every 5 minutes
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  return { stats, loading, error };
};
