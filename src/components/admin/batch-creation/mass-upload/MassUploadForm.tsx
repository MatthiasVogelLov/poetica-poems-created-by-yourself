
import React from 'react';
import { Style, VerseType, Length } from '@/types/poem';
import StyleRhymeSection from '../form-sections/StyleRhymeSection';
import FileUploadSection from './FileUploadSection';
import PoemEntriesSection from './PoemEntriesSection';
import OptionsSection from './OptionsSection';
import SubmitSection from './SubmitSection';

interface PoemEntry {
  title: string;
  keywords: string;
}

interface MassUploadFormProps {
  style: Style;
  verseType: VerseType;
  length: Length;
  useRandomOptions: boolean;
  publishToPoemsLand: boolean;
  poemEntries: PoemEntry[];
  onStyleChange: (style: Style) => void;
  onVerseTypeChange: (verseType: VerseType) => void;
  onLengthChange: (length: Length) => void;
  onRandomOptionsChange: (useRandom: boolean) => void;
  onPublishToPoemsLandChange: (publish: boolean) => void;
  onPoemEntryChange: (index: number, field: 'title' | 'keywords', value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const MassUploadForm: React.FC<MassUploadFormProps> = ({
  style,
  verseType,
  length,
  useRandomOptions,
  publishToPoemsLand,
  poemEntries,
  onStyleChange,
  onVerseTypeChange,
  onLengthChange,
  onRandomOptionsChange,
  onPublishToPoemsLandChange,
  onPoemEntryChange,
  onGenerate,
  isGenerating,
}) => {
  const handleStyleRhymeChange = (field: string, value: any) => {
    if (field === 'style') onStyleChange(value as Style);
    if (field === 'verseType') onVerseTypeChange(value as VerseType);
    if (field === 'length') onLengthChange(value as Length);
  };

  const handleFileDataLoaded = (data: string[][]) => {
    // Update each poem entry with data from Excel
    data.forEach((row, index) => {
      const [title, keywords] = row;
      onPoemEntryChange(index, 'title', title || '');
      onPoemEntryChange(index, 'keywords', keywords || '');
    });
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
        
        <OptionsSection 
          useRandomOptions={useRandomOptions}
          onRandomOptionsChange={onRandomOptionsChange}
        />
      </div>

      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-medium mb-4">Gedichte-Eingabe</h3>
        
        <FileUploadSection onFileDataLoaded={handleFileDataLoaded} />
        
        <PoemEntriesSection 
          poemEntries={poemEntries}
          onPoemEntryChange={onPoemEntryChange}
        />
      </div>

      <SubmitSection 
        isGenerating={isGenerating}
        onGenerate={onGenerate}
        disabled={poemEntries.every(entry => !entry.title.trim())}
        publishToPoemsLand={publishToPoemsLand}
        onPublishToPoemsLandChange={onPublishToPoemsLandChange}
      />
    </div>
  );
};

export default MassUploadForm;
