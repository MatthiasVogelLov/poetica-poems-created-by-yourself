
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';

interface KeywordsSectionProps {
  keywords: string;
  onKeywordsChange: (value: string) => void;
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({ keywords, onKeywordsChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="poem-keywords" className="text-sm font-medium">Schlüsselwörter (SEO-relevant)</Label>
      <Input
        id="poem-keywords"
        type="text"
        value={keywords}
        onChange={(e) => onKeywordsChange(e.target.value)}
        className="w-full"
        placeholder="Schlüsselwörter durch Komma getrennt"
      />
      <FormDescription className="text-xs">
        Schlüsselwörter verbessern die Auffindbarkeit in Suchmaschinen. Nomen werden automatisch großgeschrieben und am Ende des Gedichts aufgelistet.
        <br />
        <span className="text-muted-foreground mt-1 block">
          Tipp: Denken Sie an Suchbegriffe, die potenzielle Leser eingeben könnten.
        </span>
      </FormDescription>
    </div>
  );
};

export default KeywordsSection;
