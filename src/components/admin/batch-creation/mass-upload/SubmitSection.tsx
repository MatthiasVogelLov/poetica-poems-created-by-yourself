
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';

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
  const { t, language } = useTranslations();
  
  const publishText = language === 'en' 
    ? "Automatically publish to PoemsLand" 
    : "Automatisch auf PoemsLand publizieren";
    
  const generateText = language === 'en'
    ? "Generate Poems"
    : "Gedichte generieren";
    
  const generatingText = language === 'en'
    ? "Generating poems..."
    : "Generiere Gedichte...";
    
  return (
    <div className="flex justify-end pt-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="publish-poems-land" 
            checked={publishToPoemsLand}
            onCheckedChange={(checked) => onPublishToPoemsLandChange(checked === true)}
          />
          <Label htmlFor="publish-poems-land">{publishText}</Label>
        </div>
        
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || disabled}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              {generatingText}
            </>
          ) : (
            <>
              <Wand2 size={16} className="mr-2" />
              {generateText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubmitSection;
