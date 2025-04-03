
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SubmitSectionProps {
  isGenerating: boolean;
  onGenerate: () => void;
  disabled: boolean;
  publishToPoemsLand: boolean;
  onPublishToPoemsLandChange: (publish: boolean) => void;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  isGenerating,
  onGenerate,
  disabled,
  publishToPoemsLand,
  onPublishToPoemsLandChange
}) => {
  return (
    <div className="flex justify-end pt-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="publish-poems-land" 
            checked={publishToPoemsLand}
            onCheckedChange={onPublishToPoemsLandChange}
          />
          <Label htmlFor="publish-poems-land">Automatisch auf PoemsLand publizieren</Label>
        </div>
        
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || disabled}
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

export default SubmitSection;
