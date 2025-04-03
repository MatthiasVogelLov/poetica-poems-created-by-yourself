
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { readExcelFile } from '../excelUtils';
import { toast } from 'sonner';

interface FileUploadSectionProps {
  onFileDataLoaded: (data: string[][]) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onFileDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setFileName(file.name);
      const data = await readExcelFile(file);
      onFileDataLoaded(data);
      
      toast.success(`Datei "${file.name}" erfolgreich importiert`);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error('Fehler beim Lesen der Excel-Datei. Bitte überprüfen Sie das Format.');
      setFileName(null);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearFileSelection = () => {
    setFileName(null);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="excel-upload">Excel-Datei (.xls/.xlsx) importieren</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={handleUploadClick}
          >
            <Upload size={16} className="mr-2" />
            Excel-Datei hochladen
          </Button>
          
          {fileName && (
            <div className="flex items-center text-sm text-muted-foreground border rounded-md px-3 py-2">
              <span className="truncate max-w-[200px]">{fileName}</span>
              <button
                type="button"
                onClick={clearFileSelection}
                className="p-1 ml-2 hover:bg-gray-100 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          id="excel-upload"
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-xs text-muted-foreground">
          Die Excel-Datei sollte 2 Spalten enthalten: Die erste für Titel, die zweite für Schlüsselwörter.
        </p>
      </div>
    </div>
  );
};

export default FileUploadSection;
