
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import StyleRhymeSection from './form-sections/StyleRhymeSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Style, VerseType, Length } from '@/types/poem';

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
  const handleStyleRhymeChange = (field: string, value: any) => {
    if (field === 'style') onStyleChange(value as Style);
    if (field === 'verseType') onVerseTypeChange(value as VerseType);
    if (field === 'length') onLengthChange(value as Length);
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
