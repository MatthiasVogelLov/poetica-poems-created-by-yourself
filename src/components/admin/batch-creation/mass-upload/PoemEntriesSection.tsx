
import React from 'react';
import { Input } from '@/components/ui/input';

interface PoemEntry {
  title: string;
  keywords: string;
}

interface PoemEntriesSectionProps {
  poemEntries: PoemEntry[];
  onPoemEntryChange: (index: number, field: 'title' | 'keywords', value: string) => void;
}

const PoemEntriesSection: React.FC<PoemEntriesSectionProps> = ({ 
  poemEntries, 
  onPoemEntryChange 
}) => {
  return (
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
  );
};

export default PoemEntriesSection;
