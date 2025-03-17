
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import StatsTable, { StatItem } from './StatsTable';

interface CategoryTabsProps {
  audienceData: StatItem[];
  occasionData: StatItem[];
  styleData: StatItem[];
  lengthData: StatItem[];
}

const CategoryTabs = ({ audienceData, occasionData, styleData, lengthData }: CategoryTabsProps) => {
  return (
    <Tabs defaultValue="audience">
      <TabsList className="grid grid-cols-4 w-full mb-6">
        <TabsTrigger value="audience">Zielgruppe</TabsTrigger>
        <TabsTrigger value="occasion">Anlass</TabsTrigger>
        <TabsTrigger value="style">Stil</TabsTrigger>
        <TabsTrigger value="length">Länge</TabsTrigger>
      </TabsList>
      
      <TabsContent value="audience">
        <Card>
          <CardContent className="p-6 pt-8">
            <StatsTable title="Gedichte nach Zielgruppe" data={audienceData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="occasion">
        <Card>
          <CardContent className="p-6 pt-8">
            <StatsTable title="Gedichte nach Anlass" data={occasionData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="style">
        <Card>
          <CardContent className="p-6 pt-8">
            <StatsTable title="Gedichte nach Stil" data={styleData} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="length">
        <Card>
          <CardContent className="p-6 pt-8">
            <StatsTable title="Gedichte nach Länge" data={lengthData} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CategoryTabs;
