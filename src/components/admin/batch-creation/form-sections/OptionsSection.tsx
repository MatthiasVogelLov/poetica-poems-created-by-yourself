
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CircleCheck } from 'lucide-react';

interface OptionsSectionProps {
  generateContent: boolean;
  publishAfterCreation: boolean;
  onOptionChange: (field: string, value: boolean) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  generateContent,
  publishAfterCreation,
  onOptionChange
}) => {
  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="generate-content"
          checked={generateContent}
          onCheckedChange={(value) => onOptionChange('generateContent', value)}
        />
        <Label htmlFor="generate-content" className="font-medium">
          Inhalt automatisch generieren
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="publish-after-creation"
          checked={publishAfterCreation}
          onCheckedChange={(value) => onOptionChange('publishAfterCreation', value)}
        />
        <Label htmlFor="publish-after-creation" className="font-medium">
          Nach Erstellung direkt veröffentlichen
        </Label>
        {publishAfterCreation && (
          <Badge variant="success" className="ml-2">
            <CircleCheck className="h-3 w-3 mr-1" />
            Wird direkt in PoemsLand erscheinen
          </Badge>
        )}
      </div>
    </div>
  );
};

export default OptionsSection;
