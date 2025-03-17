
import { StatItem } from "@/hooks/use-stats-data";

/**
 * Converts stat data to CSV format
 */
export const convertToCSV = (
  data: StatItem[], 
  title: string
): string => {
  // CSV header row
  let csv = `${title} Name,Total,Today\n`;
  
  // Add data rows
  data.forEach(item => {
    csv += `${item.name},${item.value},${item.todayValue}\n`;
  });
  
  return csv;
};

/**
 * Converts stats data to JSON format
 */
export const convertToJSON = (
  data: StatItem[],
  title: string
): string => {
  const jsonData = {
    title,
    data: data.map(item => ({
      name: item.name,
      total: item.value,
      today: item.todayValue
    }))
  };
  
  return JSON.stringify(jsonData, null, 2);
};

/**
 * Triggers a download of data as a file
 */
export const downloadData = (
  data: string, 
  filename: string, 
  mimeType: string
): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger click
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Create a full dataset with all statistics
 */
export const createFullDataset = (
  stats: {
    totalPoems: number;
    todayPoems: number;
    keywordsUsed: number;
    keywordsTodayUsed: number;
    audienceData: StatItem[];
    occasionData: StatItem[];
    styleData: StatItem[];
    lengthData: StatItem[];
    featureData: StatItem[];
  }
): string => {
  // Create a comprehensive JSON object with all stats
  const fullData = {
    overview: {
      totalPoems: stats.totalPoems,
      todayPoems: stats.todayPoems,
      keywordsUsed: stats.keywordsUsed,
      keywordsTodayUsed: stats.keywordsTodayUsed
    },
    audienceData: stats.audienceData,
    occasionData: stats.occasionData,
    styleData: stats.styleData,
    lengthData: stats.lengthData,
    featureData: stats.featureData
  };
  
  return JSON.stringify(fullData, null, 2);
};
