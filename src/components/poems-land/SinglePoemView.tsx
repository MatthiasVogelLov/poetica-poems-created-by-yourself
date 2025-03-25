
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Circle, PenLine } from 'lucide-react';
import LoadingState from '@/components/admin/LoadingState';
import { Badge } from '@/components/ui/badge';

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

  // Generate plain HTML version for search engines
  const plainHtmlContent = poem.content
    .split("\n")
    .map(line => `<p>${line}</p>`)
    .join("");

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
        {/* Hidden pre-rendered content for search engines */}
        <div 
          className="hidden" 
          dangerouslySetInnerHTML={{ 
            __html: `
              <div itemscope itemtype="https://schema.org/Poem">
                <h1 itemprop="name">${poem.title}</h1>
                <div itemprop="text">${plainHtmlContent}</div>
                ${poem.occasion ? `<meta itemprop="keywords" content="${poem.occasion}">` : ''}
                ${poem.content_type ? `<meta itemprop="genre" content="${poem.content_type}">` : ''}
                ${poem.audience ? `<meta itemprop="audience" content="${poem.audience}">` : ''}
                <meta itemprop="datePublished" content="${new Date(poem.created_at || new Date()).toISOString()}">
              </div>
            `
          }} 
        />
        
        <article 
          itemScope 
          itemType="https://schema.org/Poem"
          id="poem-content"
          className="poem-article"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-serif mb-2" itemProp="name">{poem.title}</h1>
            
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
                  {poem.occasion}
                </Badge>
              )}
              
              {poem.content_type && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:scale-105 hover:shadow-sm">
                  {poem.content_type}
                </Badge>
              )}
              
              {poem.audience && (
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 transition-all duration-300 hover:bg-amber-100 hover:text-amber-700 hover:scale-105 hover:shadow-sm">
                  {poem.audience}
                </Badge>
              )}
            </div>
          </div>
          
          <div 
            className="poem-content text-lg md:text-xl leading-relaxed mb-12 whitespace-pre-line font-serif text-center"
            itemProp="text"
          >
            {formatContent(poem.content)}
          </div>
          
          {/* SEO Content - Visible to search engines but styled to look the same as the above content */}
          <div 
            className="sr-only" 
            aria-hidden="true"
            data-nosnippet="false"
          >
            <h2>Vollständiger Gedichttext</h2>
            <div dangerouslySetInnerHTML={{ __html: plainHtmlContent }}></div>
            {poem.occasion && <p>Anlass: {poem.occasion}</p>}
            {poem.content_type && <p>Thema: {poem.content_type}</p>}
            {poem.audience && <p>Zielgruppe: {poem.audience}</p>}
          </div>
          
          {/* Additional SEO metadata */}
          <meta itemProp="datePublished" content={new Date(poem.created_at || new Date()).toISOString()} />
          {poem.occasion && <meta itemProp="keywords" content={poem.occasion} />}
          {poem.content_type && <meta itemProp="keywords" content={poem.content_type} />}
          {poem.audience && <meta itemProp="audience" content={poem.audience} />}
          
          {/* Add the poem content directly as a hidden meta property for search engines */}
          <meta itemProp="poemText" content={poem.content} />
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
