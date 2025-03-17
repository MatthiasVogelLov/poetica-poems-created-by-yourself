import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  convertToCSV, 
  convertToJSON,
  downloadData,
  createFullDataset
} from '@/utils/exportData';
import { StatItem, StatsData } from '@/types/stats';

interface DownloadButtonProps {
  currentData?: StatItem[];
  dataTitle?: string;
  allStats?: StatsData;
}

const DownloadButton = ({ 
  currentData, 
  dataTitle = "Data", 
  allStats 
}: DownloadButtonProps) => {
  const [format, setFormat] = React.useState<string>("csv");

  const handleDownload = () => {
    if (format === "full-json" && allStats) {
      // Export all statistics as a single JSON file
      const jsonData = createFullDataset(allStats);
      downloadData(
        jsonData,
        `all-statistics.json`,
        "application/json"
      );
      return;
    }
    
    if (!currentData) return;
    
    const filename = `${dataTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
    
    if (format === "csv") {
      const csvData = convertToCSV(currentData, dataTitle);
      downloadData(
        csvData,
        `${filename}.csv`,
        "text/csv"
      );
    } else if (format === "json") {
      const jsonData = convertToJSON(currentData, dataTitle);
      downloadData(
        jsonData,
        `${filename}.json`,
        "application/json"
      );
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Select value={format} onValueChange={setFormat}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Format auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
          {allStats && (
            <SelectItem value="full-json">Alle Daten (JSON)</SelectItem>
          )}
        </SelectContent>
      </Select>
      
      <Button 
        onClick={handleDownload} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
      >
        <Download size={16} />
        <span>Herunterladen</span>
      </Button>
    </div>
  );
};

export default DownloadButton;
