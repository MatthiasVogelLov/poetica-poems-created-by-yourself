
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
  convertToXLS,
  convertToPDF,
  downloadData
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
    if (!currentData && !allStats) return;
    
    // Use all stats data if available and requested
    const dataToExport = currentData || [];
    const filename = `${dataTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
    
    if (format === "csv") {
      const csvData = convertToCSV(dataToExport, dataTitle);
      downloadData(
        csvData,
        `${filename}.csv`,
        "text/csv"
      );
    } else if (format === "xls") {
      const xlsData = convertToXLS(dataToExport, dataTitle);
      downloadData(
        xlsData,
        `${filename}.xls`,
        "application/vnd.ms-excel"
      );
    } else if (format === "pdf") {
      convertToPDF(dataToExport, dataTitle, filename);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={format} onValueChange={setFormat}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Format auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="xls">Excel</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
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
