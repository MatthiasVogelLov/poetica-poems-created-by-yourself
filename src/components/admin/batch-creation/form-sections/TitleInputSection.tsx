
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TitleInputSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
}

const TitleInputSection: React.FC<TitleInputSectionProps> = ({ title, onTitleChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="poem-title" className="text-sm font-medium">Titel</Label>
      <Input 
        id="poem-title"
        type="text" 
        value={title} 
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full"
        placeholder="Gedichttitel"
      />
      <p className="text-xs text-muted-foreground">
        Ein guter Titel verbessert die Auffindbarkeit des Gedichts in PoemsLand und in Suchmaschinen.
      </p>
    </div>
  );
};

export default TitleInputSection;
