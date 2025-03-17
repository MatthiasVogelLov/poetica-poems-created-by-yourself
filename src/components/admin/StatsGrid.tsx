
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import KeywordsStatsTable from './KeywordsStatsTable';
import CategoryTabs from './CategoryTabs';
import StatsTable from './StatsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
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
      
      <Alert className="mb-6" variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Hinweis</AlertTitle>
        <AlertDescription>
          Diese Statistiken werden derzeit mit Beispieldaten generiert. 
          Um echte Daten anzuzeigen, müsste eine Datenbank-Integration implementiert werden.
        </AlertDescription>
      </Alert>
      
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
