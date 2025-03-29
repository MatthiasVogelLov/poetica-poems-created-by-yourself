
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Search } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SubmitButtonSectionProps {
  onSubmit: () => void;
  isGenerating: boolean;
  publishAfterCreation: boolean;
}

const SubmitButtonSection: React.FC<SubmitButtonSectionProps> = ({
  onSubmit,
  isGenerating,
  publishAfterCreation
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onSubmit}
            className={`w-full mt-6 ${publishAfterCreation ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={isGenerating}
          >
            {publishAfterCreation ? (
              <>
                <Search className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generiere Gedicht...' : 'Erstellen & SEO-optimiert veröffentlichen'}
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generiere Gedicht...' : 'Gedicht erstellen'}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {publishAfterCreation 
            ? "Direkt veröffentlichen verbessert die Sichtbarkeit in Suchmaschinen" 
            : "Erstellt das Gedicht, veröffentlicht es aber nicht direkt"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SubmitButtonSection;
