
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import StatsTable, { StatItem } from './StatsTable';
import DownloadButton from './DownloadButton';

interface CategoryTabsProps {
  audienceData: StatItem[];
  occasionData: StatItem[];
  styleData: StatItem[];
  lengthData: StatItem[];
}

const CategoryTabs = ({ audienceData, occasionData, styleData, lengthData }: CategoryTabsProps) => {
  const [activeTab, setActiveTab] = React.useState('audience');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Determine which data set to use for the download based on active tab
  const getDownloadData = () => {
    switch (activeTab) {
      case 'audience':
        return { data: audienceData, title: 'Gedichte nach Zielgruppe' };
      case 'occasion':
        return { data: occasionData, title: 'Gedichte nach Anlass' };
      case 'style':
        return { data: styleData, title: 'Gedichte nach Stil' };
      case 'length':
        return { data: lengthData, title: 'Gedichte nach Länge' };
      default:
        return { data: audienceData, title: 'Gedichte nach Zielgruppe' };
    }
  };
  
  const downloadInfo = getDownloadData();
  
  return (
    <Tabs defaultValue="audience" value={activeTab} onValueChange={handleTabChange}>
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="audience">Zielgruppe</TabsTrigger>
          <TabsTrigger value="occasion">Anlass</TabsTrigger>
          <TabsTrigger value="style">Stil</TabsTrigger>
          <TabsTrigger value="length">Länge</TabsTrigger>
        </TabsList>
        
        <DownloadButton 
          currentData={downloadInfo.data}
          dataTitle={downloadInfo.title}
        />
      </div>
      
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
