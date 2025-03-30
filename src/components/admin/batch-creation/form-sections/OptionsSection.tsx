
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface OptionsSectionProps {
  generateContent: boolean;
  publishAfterCreation: boolean;
  onOptionChange: (field: string, value: any) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({ 
  generateContent, 
  publishAfterCreation, 
  onOptionChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="generate-content" className="text-sm font-medium">Inhalt automatisch generieren</Label>
          <p className="text-xs text-muted-foreground">
            Lässt KI den Gedichtinhalt automatisch generieren
          </p>
        </div>
        <Switch
          id="generate-content"
          checked={generateContent}
          onCheckedChange={(checked) => onOptionChange('generateContent', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="publish-creation" className="text-sm font-medium">Nach Erstellung veröffentlichen</Label>
          <p className="text-xs text-muted-foreground">
            Gedicht direkt für PoemsLand Besucher freischalten
          </p>
        </div>
        <Switch
          id="publish-creation"
          checked={publishAfterCreation}
          onCheckedChange={(checked) => onOptionChange('publishAfterCreation', checked)}
        />
      </div>
    </div>
  );
};

export default OptionsSection;
