
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

  // Build SEO description for the poem
  const buildSeoDescription = () => {
    const occasion = poem.occasion ? getOccasionDisplay(poem.occasion) : '';
    const contentType = poem.content_type ? getContentTypeDisplay(poem.content_type) : '';
    const audience = poem.audience ? getAudienceDisplay(poem.audience) : '';
    
    let description = `${poem.title} - Ein Gedicht`;
    if (contentType) description += ` zum Thema ${contentType}`;
    if (occasion) description += `, passend für ${occasion}`;
    if (audience) description += `, für ${audience}`;
    description += '.';
    
    // Add a small excerpt from the poem content
    const excerpt = poem.content.split('\n')[0].substring(0, 80).trim();
    if (excerpt) {
      description += ` "${excerpt}..."`;
    }
    
    return description;
  };

  // Pre-formatted content for SEO
  const seoFormattedContent = poem.content.split('\n').map(line => `<p>${line}</p>`).join('');
  const formattedDate = poem.created_at ? new Date(poem.created_at).toISOString() : new Date().toISOString();
  const seoDescription = buildSeoDescription();

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
        {/* Enhanced Schema.org markup for search engines */}
        <div 
          dangerouslySetInnerHTML={{ 
            __html: `
            <!-- Enhanced Schema.org markup for search engines -->
            <div class="poem-seo-content" style="display:none">
              <div itemscope itemtype="https://schema.org/Poem">
                <meta itemprop="headline" content="${poem.title}">
                <h1 itemprop="name">${poem.title}</h1>
                <div itemprop="text">
                  ${seoFormattedContent}
                </div>
                <meta itemprop="datePublished" content="${formattedDate}">
                <meta itemprop="description" content="${seoDescription}">
                ${poem.occasion ? `<meta itemprop="keywords" content="${getOccasionDisplay(poem.occasion)}">` : ''}
                ${poem.content_type ? `<meta itemprop="genre" content="${getContentTypeDisplay(poem.content_type)}">` : ''}
                ${poem.audience ? `<meta itemprop="audience" content="${getAudienceDisplay(poem.audience)}">` : ''}
                ${poem.style ? `<meta itemprop="about" content="${getStyleDisplay(poem.style)}">` : ''}
                <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
                  <meta itemprop="name" content="PoemsLand">
                </div>
                <meta itemprop="inLanguage" content="de">
              </div>
            </div>
            `
          }}
        />
        
        <article className="poem-article" itemScope itemType="https://schema.org/Poem">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-serif mb-2" itemProp="name">{poem.title}</h1>
            <meta itemProp="datePublished" content={formattedDate} />
            <meta itemProp="headline" content={poem.title} />
            <meta itemProp="description" content={seoDescription} />
            
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
