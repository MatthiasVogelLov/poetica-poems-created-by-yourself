
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PoemTitle from '@/components/poem-preview/PoemTitle';
import PoemContent from '@/components/poem-preview/PoemContent';
import ActionButtons from '@/components/poem-preview/ActionButtons';

interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  created_at: string;
}

interface SinglePoemViewProps {
  poem: Poem | null;
  goBack: () => void;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
}

const SinglePoemView: React.FC<SinglePoemViewProps> = ({
  poem,
  goBack,
  getOccasionDisplay,
  getContentTypeDisplay
}) => {
  if (!poem) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse">Gedicht wird geladen...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={goBack} 
        className="mb-6"
      >
        <ChevronLeft size={16} className="mr-2" />
        Zurück zu PoemsLand
      </Button>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <PoemTitle title={poem.title} />
        <PoemContent poem={poem.content} isPaid={true} isInPoemsLand={true} />
        
        {/* Add sharing features */}
        <ActionButtons poem={poem.content} title={poem.title} />
        
        <div className="flex justify-between items-center mt-6 text-sm text-muted-foreground">
          <div className="flex gap-2">
            {poem.occasion && (
              <Badge variant="secondary">{getOccasionDisplay(poem.occasion)}</Badge>
            )}
            {poem.content_type && (
              <Badge variant="outline">{getContentTypeDisplay(poem.content_type)}</Badge>
            )}
          </div>
          <span>
            {new Date(poem.created_at).toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SinglePoemView;
