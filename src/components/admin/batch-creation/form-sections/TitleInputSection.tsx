
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDescription } from '@/components/ui/form';

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
      <FormDescription className="text-xs">
        Ein guter Titel verbessert die Auffindbarkeit des Gedichts in PoemsLand und in Suchmaschinen.
      </FormDescription>
    </div>
  );
};

export default TitleInputSection;
