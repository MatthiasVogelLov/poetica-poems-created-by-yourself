
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { StatItem } from '@/types/stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DownloadButton from './DownloadButton';

interface UnifiedStatsTableProps {
  featureData: StatItem[];
  audienceData: StatItem[];
  occasionData: StatItem[];
  styleData: StatItem[];
  lengthData: StatItem[];
  keywordsData: StatItem[];
}

const UnifiedStatsTable = ({ 
  featureData, 
  audienceData, 
  occasionData, 
  styleData, 
  lengthData,
  keywordsData
}: UnifiedStatsTableProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Combine all data
  const allData = [
    ...featureData.map(item => ({ ...item, category: 'Feature-Nutzung' })),
    ...audienceData.map(item => ({ ...item, category: 'Zielgruppe' })),
    ...occasionData.map(item => ({ ...item, category: 'Anlass' })),
    ...styleData.map(item => ({ ...item, category: 'Stil' })),
    ...lengthData.map(item => ({ ...item, category: 'Länge' })),
    ...keywordsData.map(item => ({ ...item, category: 'Schlüsselwörter' })),
  ];

  // Get data based on active category
  const getFilteredData = () => {
    if (activeCategory === "all") {
      return allData;
    }
    return allData.filter(item => item.category === activeCategory);
  };

  const filteredData = getFilteredData();
  
  // Get category-specific data for download
  const getCategoryData = (category: string) => {
    if (category === "all") {
      return allData;
    }
    return allData.filter(item => item.category === category);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="Feature-Nutzung">Features</TabsTrigger>
            <TabsTrigger value="Zielgruppe">Zielgruppe</TabsTrigger>
            <TabsTrigger value="Anlass">Anlass</TabsTrigger>
            <TabsTrigger value="Stil">Stil</TabsTrigger>
            <TabsTrigger value="Länge">Länge</TabsTrigger>
            <TabsTrigger value="Schlüsselwörter">Schlüsselwörter</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex-shrink-0 ml-4">
          <DownloadButton 
            currentData={getCategoryData(activeCategory)} 
            dataTitle={activeCategory === "all" ? "Alle Statistiken" : activeCategory}
          />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Kategorie</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Gesamt</TableHead>
              <TableHead className="text-right">Heute</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={`${item.category}-${item.name}-${index}`}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.todayValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnifiedStatsTable;
