
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Upload, X } from 'lucide-react';
import StyleRhymeSection from './form-sections/StyleRhymeSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Style, VerseType, Length } from '@/types/poem';
import { toast } from 'sonner';
import { readExcelFile } from './excelUtils';

interface PoemEntry {
  title: string;
  keywords: string;
}

interface MassUploadFormProps {
  style: Style;
  verseType: VerseType;
  length: Length;
  useRandomOptions: boolean;
  poemEntries: PoemEntry[];
  onStyleChange: (style: Style) => void;
  onVerseTypeChange: (verseType: VerseType) => void;
  onLengthChange: (length: Length) => void;
  onRandomOptionsChange: (useRandom: boolean) => void;
  onPoemEntryChange: (index: number, field: 'title' | 'keywords', value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const MassUploadForm: React.FC<MassUploadFormProps> = ({
  style,
  verseType,
  length,
  useRandomOptions,
  poemEntries,
  onStyleChange,
  onVerseTypeChange,
  onLengthChange,
  onRandomOptionsChange,
  onPoemEntryChange,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleStyleRhymeChange = (field: string, value: any) => {
    if (field === 'style') onStyleChange(value as Style);
    if (field === 'verseType') onVerseTypeChange(value as VerseType);
    if (field === 'length') onLengthChange(value as Length);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setFileName(file.name);
      const data = await readExcelFile(file);
      
      // Update each poem entry with data from Excel
      // This will work even if there are more than 5 entries
      data.forEach((row, index) => {
        if (index < poemEntries.length) {
          // Update existing entries
          const [title, keywords] = row;
          onPoemEntryChange(index, 'title', title || '');
          onPoemEntryChange(index, 'keywords', keywords || '');
        } else {
          // For additional entries, we need to add new entries to the poemEntries array
          // This will be handled in useMassUpload.ts via the onPoemEntryChange callback
          // by checking if the index is beyond the current array length
          const [title, keywords] = row;
          onPoemEntryChange(index, 'title', title || '');
          onPoemEntryChange(index, 'keywords', keywords || '');
        }
      });
      
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
    <div className="space-y-6">
      <div className="space-y-4">
        <StyleRhymeSection
          style={style}
          verseType={verseType}
          length={length}
          onFieldChange={handleStyleRhymeChange}
        />
        
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="random-options"
            checked={useRandomOptions}
            onCheckedChange={onRandomOptionsChange}
          />
          <Label htmlFor="random-options">Optionen zufällig wählen</Label>
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-4">Gedichte-Eingabe</h3>
        
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
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-sm font-medium text-muted-foreground">Titel</div>
            <div className="text-sm font-medium text-muted-foreground">Schlüsselwörter</div>
          </div>
          
          {poemEntries.map((entry, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Gedichttitel"
                value={entry.title}
                onChange={(e) => onPoemEntryChange(index, 'title', e.target.value)}
              />
              <Input
                placeholder="Schlüsselwörter durch Komma getrennt"
                value={entry.keywords}
                onChange={(e) => onPoemEntryChange(index, 'keywords', e.target.value)}
              />
            </div>
          ))}
          
          <p className="text-xs text-muted-foreground mt-2">
            Schlüsselwörter verbessern die Auffindbarkeit in Suchmaschinen. Nomen werden automatisch großgeschrieben und am Ende des Gedichts aufgelistet.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || poemEntries.every(entry => !entry.title.trim())}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
            <span className="animate-pulse">Generiere Gedichte...</span>
          ) : (
            <>
              <Wand2 size={16} className="mr-2" />
              Gedichte generieren
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MassUploadForm;
