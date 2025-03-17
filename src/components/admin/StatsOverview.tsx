
import React from 'react';
import StatCard from './StatCard';

interface StatsOverviewProps {
  totalPoems: number;
  todayPoems: number;
  keywordsUsed: number;
}

const StatsOverview = ({ totalPoems, todayPoems, keywordsUsed }: StatsOverviewProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-3">Übersicht Gedichte</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Gedichte insgesamt" 
          value={totalPoems} 
          description="Gesamtzahl aller erstellten Gedichte"
        />
        <StatCard 
          title="Gedichte heute" 
          value={todayPoems} 
          description="Anzahl der heute erstellten Gedichte"
        />
        <StatCard 
          title="Mit individuellen Wörtern" 
          value={keywordsUsed} 
          description="Gedichte mit benutzerdefinierten Schlüsselwörtern"
        />
      </div>
    </div>
  );
};

export default StatsOverview;
