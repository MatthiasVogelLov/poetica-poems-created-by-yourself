
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Poem } from '@/types/poem-types';
import { Button } from '@/components/ui/button';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import { ArrowLeft } from 'lucide-react';
import PoemSEO from './PoemSEO';
import PoemStructuredData from './PoemStructuredData';

interface SinglePoemViewProps {
  poem: Poem | null;
  isLoading: boolean;
  navigateBack: () => void;
  isPreview?: boolean;
}

const SinglePoemView: React.FC<SinglePoemViewProps> = ({ 
  poem, 
  isLoading, 
  navigateBack,
  isPreview = false
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse">Gedicht wird geladen...</div>
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-muted-foreground mb-4">Gedicht nicht gefunden</p>
        <Button onClick={navigateBack}>
          Zurück zu allen Gedichten
        </Button>
      </div>
    );
  }

  // Set up SEO metadata for the poem
  const host = window.location.origin;
  const poemUrl = `${host}/poemsland/${poem.id}`;

  return (
    <>
      {/* Add SEO components */}
      <PoemSEO poem={poem} isPreview={isPreview} />
      <PoemStructuredData poem={poem} host={host} poemUrl={poemUrl} />
      
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={navigateBack}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu allen Gedichten
        </Button>

        <Card className="max-w-3xl mx-auto shadow-md">
          <CardContent className="pt-6">
            <article>
              <header>
                <h1 className="text-2xl font-serif text-center mb-6">{poem.title}</h1>
              </header>
              
              <div className="whitespace-pre-wrap text-center font-serif leading-relaxed mb-6">
                {poem.content}
              </div>
              
              <footer className="flex flex-wrap gap-2 mt-6 justify-center">
                {poem.occasion && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {getOccasionDisplay(poem.occasion)}
                  </span>
                )}
                {poem.content_type && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {getContentTypeDisplay(poem.content_type)}
                  </span>
                )}
              </footer>
            </article>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SinglePoemView;
