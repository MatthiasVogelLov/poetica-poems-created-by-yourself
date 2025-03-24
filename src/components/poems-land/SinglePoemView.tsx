
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Circle, PenLine } from 'lucide-react';
import LoadingState from '@/components/admin/LoadingState';

interface SinglePoemViewProps {
  poem: any | null;
  isLoading: boolean;
  navigateBack: () => void;
  isPreview?: boolean;
  handleCreatePoem?: () => void;
}

const SinglePoemView: React.FC<SinglePoemViewProps> = ({
  poem,
  isLoading,
  navigateBack,
  isPreview = false,
  handleCreatePoem
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!poem) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">Gedicht nicht gefunden</p>
        <Button onClick={navigateBack}>Zurück zu allen Gedichten</Button>
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={navigateBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zu allen Gedichten
      </Button>
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-serif mb-2">{poem.title}</h1>
          
          {isPreview && (
            <div className="flex items-center justify-center text-sm text-amber-600 mb-4">
              <Circle className="h-3 w-3 fill-current mr-1" />
              Vorschau-Modus
            </div>
          )}
        </div>
        
        <div className="poem-content text-lg md:text-xl leading-relaxed mb-12 whitespace-pre-line font-serif text-center">
          {formatContent(poem.content)}
        </div>
        
        {/* Create poem button */}
        {handleCreatePoem && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleCreatePoem}
              className="px-4 py-2 text-sm flex items-center gap-2 mx-auto"
            >
              <PenLine className="w-4 h-4" />
              <span>Erstelle Dein eigenes Gedicht</span>
            </Button>
          </div>
        )}
        
        {/* Hidden div for SEO */}
        <div className="hidden" aria-hidden="true" data-seo-content>
          <h2>{poem.title}</h2>
          <p>{poem.content}</p>
        </div>
      </div>
    </div>
  );
};

export default SinglePoemView;
