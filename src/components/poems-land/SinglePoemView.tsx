
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Circle, PenLine } from 'lucide-react';
import LoadingState from '@/components/admin/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Poem } from '@/types/poem-types';
import ActionButtons from '@/components/poem-preview/ActionButtons';
import { getOccasionDisplay, getContentTypeDisplay, getStyleDisplay, getAudienceDisplay } from '@/utils/poem-display-helpers';

interface SinglePoemViewProps {
  poem: Poem | null;
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

  // Format content for visual display
  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // Pre-formatted content for SEO
  const seoFormattedContent = poem.content.split('\n').map(line => `<p>${line}</p>`).join('');
  const formattedDate = poem.created_at ? new Date(poem.created_at).toISOString() : new Date().toISOString();

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
        {/* Enhanced Poem Content for Search Engines - hidden from users but visible to crawlers */}
        <div 
          dangerouslySetInnerHTML={{ 
            __html: `
            <!-- Poem Content for Search Engines -->
            <div class="poem-seo-content">
              <div itemscope itemtype="https://schema.org/Poem" style="display:none">
                <h1 itemprop="name">${poem.title}</h1>
                <div itemprop="text">
                  ${seoFormattedContent}
                </div>
                <meta itemprop="datePublished" content="${formattedDate}">
                ${poem.occasion ? `<meta itemprop="keywords" content="${poem.occasion}">` : ''}
                ${poem.content_type ? `<meta itemprop="genre" content="${poem.content_type}">` : ''}
                ${poem.audience ? `<meta itemprop="audience" content="${poem.audience}">` : ''}
              </div>
            </div>
            `
          }}
        />
        
        <article className="poem-article" itemScope itemType="https://schema.org/Poem">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-serif mb-2" itemProp="name">{poem.title}</h1>
            <meta itemProp="datePublished" content={formattedDate} />
            
            {isPreview && (
              <div className="flex items-center justify-center text-sm text-amber-600 mb-4">
                <Circle className="h-3 w-3 fill-current mr-1" />
                Vorschau-Modus
              </div>
            )}
            
            {/* Poem metadata badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {poem.occasion && (
                <Badge variant="secondary" className="transition-all duration-300 hover:bg-violet-100 hover:text-violet-700 hover:scale-105 hover:shadow-sm">
                  <span itemProp="keywords">{getOccasionDisplay(poem.occasion)}</span>
                </Badge>
              )}
              
              {poem.content_type && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:scale-105 hover:shadow-sm">
                  <span itemProp="genre">{getContentTypeDisplay(poem.content_type)}</span>
                </Badge>
              )}
              
              {poem.audience && (
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 transition-all duration-300 hover:bg-amber-100 hover:text-amber-700 hover:scale-105 hover:shadow-sm">
                  {getAudienceDisplay(poem.audience)}
                </Badge>
              )}
              
              {poem.style && (
                <Badge variant="info" className="transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:scale-105 hover:shadow-sm">
                  {getStyleDisplay(poem.style)}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="poem-content text-lg md:text-xl leading-relaxed mb-12 whitespace-pre-line font-serif text-center" itemProp="text">
            {formatContent(poem.content)}
          </div>
          
          {/* Sharing functionality */}
          <div className="mb-12">
            <ActionButtons poem={poem.content} title={poem.title} />
          </div>
        </article>
        
        {/* Create poem button */}
        {handleCreatePoem && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleCreatePoem}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 px-4 py-2 text-sm flex items-center gap-2 mx-auto hover:shadow-md hover:scale-105"
            >
              <PenLine className="w-4 h-4" />
              <span>Erstelle Dein eigenes Gedicht</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePoemView;
