
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';

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
    <Button 
      onClick={onSubmit}
      className={`w-full mt-6 ${publishAfterCreation ? 'bg-green-600 hover:bg-green-700' : ''}`}
      disabled={isGenerating}
    >
      {publishAfterCreation ? (
        <>
          <Upload className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generiere Gedicht...' : 'Gedicht erstellen & veröffentlichen'}
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generiere Gedicht...' : 'Gedicht erstellen'}
        </>
      )}
    </Button>
  );
};

export default SubmitButtonSection;
