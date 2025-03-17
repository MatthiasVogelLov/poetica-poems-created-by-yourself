
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import KeywordsStatsTable from './KeywordsStatsTable';
import CategoryTabs from './CategoryTabs';
import { Card, CardContent } from '@/components/ui/card';
import { generateDummyStats } from './statsData';

const StatsGrid = () => {
  const [stats, setStats] = useState(generateDummyStats());
  
  // In a real app, you would fetch data from an API or database
  // useEffect(() => {
  //   async function fetchStats() {
  //     try {
  //       const response = await fetch('/api/stats');
  //       const data = await response.json();
  //       setStats(data);
  //     } catch (error) {
  //       console.error("Failed to fetch statistics:", error);
  //     }
  //   }
  //   fetchStats();
  // }, []);

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Statistiken</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard title="Gedichte insgesamt" value={stats.totalPoems} />
        <StatCard title="Gedichte heute" value={stats.todayPoems} />
      </div>

      <Card>
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
