
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import StyleRhymeSection from './form-sections/StyleRhymeSection';
import TitleInputSection from './form-sections/TitleInputSection';
import KeywordsSection from './form-sections/KeywordsSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
        <div className="space-y-6">
          {poemEntries.map((entry, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <h4 className="font-medium">Gedicht {index + 1}</h4>
              <TitleInputSection
                title={entry.title}
                onTitleChange={(value) => onPoemEntryChange(index, 'title', value)}
              />
              <KeywordsSection
                keywords={entry.keywords}
                onKeywordsChange={(value) => onPoemEntryChange(index, 'keywords', value)}
              />
            </div>
          ))}
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
