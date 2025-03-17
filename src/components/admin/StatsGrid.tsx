
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import KeywordsStatsTable from './KeywordsStatsTable';
import CategoryTabs from './CategoryTabs';
import StatsTable from './StatsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertTriangleIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const StatsGrid = () => {
  const [stats, setStats] = useState({
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
  
  useEffect(() => {
    async function fetchStats() {
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

        // Convert string counts to numbers for all stats
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
    }
    
    fetchStats();
    
    // Set up polling to refresh stats every 5 minutes
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <p>Statistiken werden geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>
            Die Statistiken konnten nicht geladen werden: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Statistiken</h2>
      
      <h3 className="text-xl font-medium mb-3">Übersicht Gedichte</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Gedichte insgesamt" 
          value={stats.totalPoems} 
          description="Gesamtzahl aller erstellten Gedichte"
        />
        <StatCard 
          title="Gedichte heute" 
          value={stats.todayPoems} 
          description="Anzahl der heute erstellten Gedichte"
        />
        <StatCard 
          title="Mit individuellen Wörtern" 
          value={stats.keywordsUsed} 
          description="Gedichte mit benutzerdefinierten Schlüsselwörtern"
        />
      </div>

      <h3 className="text-xl font-medium mb-3">Feature-Nutzung</h3>
      <Card className="mb-6">
        <CardContent className="p-6">
          <StatsTable 
            title="Feature Nutzung" 
            data={stats.featureData} 
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <KeywordsStatsTable 
            keywordsUsed={stats.keywordsUsed} 
            keywordsTodayUsed={stats.keywordsTodayUsed} 
          />
        </CardContent>
      </Card>
      
      <CategoryTabs 
        audienceData={stats.audienceData}
        occasionData={stats.occasionData}
        styleData={stats.styleData}
        lengthData={stats.lengthData}
      />
    </div>
  );
};

export default StatsGrid;
