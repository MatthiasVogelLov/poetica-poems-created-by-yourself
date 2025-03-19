import { StatItem, StatsData } from "@/types/stats";
import jsPDF from "jspdf";

/**
 * Converts stat data to CSV format
 */
export const convertToCSV = (
  data: StatItem[], 
  title: string
): string => {
  // CSV header row
  let csv = `Kategorie,Name,Gesamt,Heute\n`;
  
  // Add data rows
  data.forEach(item => {
    const category = item.category || title;
    csv += `"${category}","${item.name}",${item.value},${item.todayValue}\n`;
  });
  
  return csv;
};

/**
 * Converts stats data to XLS (HTML table) format
 * This creates a simple HTML table that Excel can open
 */
export const convertToXLS = (
  data: StatItem[],
  title: string
): string => {
  let xlsContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="ProgId" content="Excel.Sheet">
      <meta name="Generator" content="Microsoft Excel 11">
      <style>
        table { border-collapse: collapse; }
        td, th { border: 1px solid #888; padding: 5px; }
        th { background-color: #eee; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th colspan="4">${title}</th>
          </tr>
          <tr>
            <th>Kategorie</th>
            <th>Name</th>
            <th>Gesamt</th>
            <th>Heute</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  data.forEach(item => {
    const category = item.category || title;
    xlsContent += `
      <tr>
        <td>${category}</td>
        <td>${item.name}</td>
        <td>${item.value}</td>
        <td>${item.todayValue}</td>
      </tr>
    `;
  });
  
  xlsContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  return xlsContent;
};

/**
 * Converts stats data to PDF and initiates download
 */
export const convertToPDF = (
  data: StatItem[],
  title: string,
  filename: string
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set margins and usable area
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, margin);
  
  // Add subtitle with date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, margin, margin + 8);
  
  // Add table header
  const headers = ['Kategorie', 'Name', 'Gesamt', 'Heute'];
  const columnWidths = [40, 60, 30, 30];
  
  // Calculate total width to center the table
  const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
  const startX = (pageWidth - tableWidth) / 2;
  
  // Draw table header
  doc.setFillColor(240, 240, 240);
  doc.rect(startX, margin + 15, tableWidth, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  let currentX = startX;
  headers.forEach((header, i) => {
    doc.text(header, currentX + 3, margin + 21);
    currentX += columnWidths[i];
  });
  
  // Draw table data
  doc.setFont('helvetica', 'normal');
  
  let y = margin + 25;
  const rowHeight = 8;
  
  data.forEach((item, rowIndex) => {
    // Add new page if needed
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
      
      // Redraw header on new page
      doc.setFillColor(240, 240, 240);
      doc.rect(startX, y, tableWidth, 10, 'F');
      
      doc.setFont('helvetica', 'bold');
      currentX = startX;
      headers.forEach((header, i) => {
        doc.text(header, currentX + 3, y + 6);
        currentX += columnWidths[i];
      });
      
      y += 10;
      doc.setFont('helvetica', 'normal');
    }
    
    // Draw alternating row background
    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(startX, y, tableWidth, rowHeight, 'F');
    }
    
    // Draw row data
    const category = item.category || title;
    const rowData = [
      category, 
      item.name, 
      item.value.toLocaleString(), 
      item.todayValue.toString()
    ];
    
    currentX = startX;
    rowData.forEach((text, i) => {
      doc.text(text, currentX + 3, y + 6);
      currentX += columnWidths[i];
    });
    
    y += rowHeight;
  });
  
  // Draw table border
  doc.setDrawColor(200, 200, 200);
  doc.rect(startX, margin + 15, tableWidth, y - (margin + 15));
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Erstellt mit poetica.apvora.com', margin, pageHeight - margin);
  
  doc.save(`${filename}.pdf`);
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
