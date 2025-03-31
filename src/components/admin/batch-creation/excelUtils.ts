
import * as XLSX from 'xlsx';

/**
 * Reads and parses an Excel file (.xls or .xlsx)
 * @param file The Excel file to parse
 * @returns Promise resolving to a 2D array of data from the Excel file
 */
export const readExcelFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays (remove the 5-row limit)
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        
        // Ensure we have at least two columns (title and keywords)
        const processedData = jsonData.map(row => {
          // If row has less than 2 columns, pad with empty strings
          if (row.length < 2) {
            return [...row, ...Array(2 - row.length).fill('')];
          }
          // If row has more than 2 columns, only take the first 2
          return row.slice(0, 2);
        });
        
        resolve(processedData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error('Invalid Excel file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read the file as binary
    reader.readAsBinaryString(file);
  });
};
