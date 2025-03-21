
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { StatItem } from '@/types/stats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DownloadButton from './DownloadButton';

interface UnifiedStatsTableProps {
  featureData: StatItem[];
  audienceData: StatItem[];
  occasionData: StatItem[];
  styleData: StatItem[];
  lengthData: StatItem[];
  keywordsData: StatItem[];
  subscriberData?: StatItem[];
}

const UnifiedStatsTable = ({ 
  featureData, 
  audienceData, 
  occasionData, 
  styleData, 
  lengthData,
  keywordsData,
  subscriberData = []
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
    ...subscriberData.map(item => ({ ...item, category: 'Abonnenten' })),
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
        <div className="w-full max-w-xs">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="Feature-Nutzung">Features</SelectItem>
              <SelectItem value="Zielgruppe">Zielgruppe</SelectItem>
              <SelectItem value="Anlass">Anlass</SelectItem>
              <SelectItem value="Stil">Stil</SelectItem>
              <SelectItem value="Länge">Länge</SelectItem>
              <SelectItem value="Schlüsselwörter">Schlüsselwörter</SelectItem>
              {subscriberData.length > 0 && (
                <SelectItem value="Abonnenten">Abonnenten</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
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
