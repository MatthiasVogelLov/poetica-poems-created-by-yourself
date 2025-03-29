
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';

interface PoemContentSectionProps {
  content: string;
  onContentChange: (value: string) => void;
  onGenerateClick?: () => void;
  isGenerating: boolean;
  shouldGenerateContent: boolean;
}

const PoemContentSection: React.FC<PoemContentSectionProps> = ({
  content,
  onContentChange,
  onGenerateClick,
  isGenerating,
  shouldGenerateContent
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium">Gedichtinhalt</label>
        
        {onGenerateClick && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGenerateClick}
            disabled={isGenerating}
          >
            <Wand2 className="mr-1 h-4 w-4" />
            {isGenerating ? 'Generiere...' : 'Jetzt generieren'}
          </Button>
        )}
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[200px]"
        placeholder={shouldGenerateContent 
          ? "Inhalt wird beim Speichern automatisch generiert..." 
          : "Geben Sie hier den Inhalt des Gedichts ein..."}
        disabled={isGenerating}
      />
    </div>
  );
};

export default PoemContentSection;
