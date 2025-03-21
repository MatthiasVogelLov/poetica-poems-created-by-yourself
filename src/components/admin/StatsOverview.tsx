
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Key, Users } from 'lucide-react';

interface StatsOverviewProps {
  totalPoems: number;
  todayPoems: number;
  keywordsUsed: number;
  subscribersCount?: number;
  subscribersTodayCount?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalPoems,
  todayPoems,
  keywordsUsed,
  subscribersCount = 0,
  subscribersTodayCount = 0
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        icon={<BookOpen size={20} />} 
        title="Gedichte gesamt" 
        value={totalPoems.toLocaleString()} 
        subValue={`+${todayPoems} heute`}
      />

      <StatCard 
        icon={<Key size={20} />} 
        title="Mit Schlüsselwörtern" 
        value={keywordsUsed.toLocaleString()} 
        subValue="individuelle Texte"
      />
      
      <StatCard 
        icon={<Users size={20} />} 
        title="Abonnenten gesamt" 
        value={subscribersCount.toLocaleString()} 
        subValue={`+${subscribersTodayCount} heute`}
      />

      <StatCard 
        icon={<Users size={20} />} 
        title="Newsletter-Quote" 
        value={totalPoems > 0 ? `${((subscribersCount / totalPoems) * 100).toFixed(1)}%` : "0%"} 
        subValue="der Nutzer"
      />
    </div>
  );
};

const StatCard = ({ 
  icon, 
  title, 
  value, 
  subValue 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subValue: string; 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{subValue}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsOverview;
