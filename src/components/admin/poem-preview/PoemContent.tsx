
import React from 'react';
import { getOccasionDisplay, getContentTypeDisplay, getAudienceDisplay, getStyleDisplay } from '@/utils/poem-display-helpers';

interface PoemContentProps {
  poem: any;
}

const PoemContent: React.FC<PoemContentProps> = ({ poem }) => {
  if (!poem) return null;
  
  // Format keywords to capitalize nouns (German convention)
  const formatKeywords = (keywords: string) => {
    if (!keywords) return '';
    
    return keywords.split(',')
      .map(word => {
        const trimmedWord = word.trim();
        // In German, nouns are capitalized
        return trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1);
      })
      .join(', ');
  };
  
  return (
    <div className="poem-container rounded-lg p-6 border shadow-sm">
      <h2 className="text-xl font-serif text-center mb-6">{poem.title}</h2>
      
      <div className="whitespace-pre-wrap text-center font-serif leading-relaxed">
        {poem.content}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-6 text-sm text-gray-500 justify-center">
        {poem.occasion && (
          <span className="bg-gray-100 rounded-full px-3 py-1">
            {getOccasionDisplay(poem.occasion)}
          </span>
        )}
        {poem.content_type && (
          <span className="bg-gray-100 rounded-full px-3 py-1">
            {getContentTypeDisplay(poem.content_type)}
          </span>
        )}
        {poem.style && (
          <span className="bg-gray-100 rounded-full px-3 py-1">
            {getStyleDisplay(poem.style)}
          </span>
        )}
      </div>
      
      {poem.keywords && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          <p className="font-medium">Schlüsselwörter:</p>
          <p>{formatKeywords(poem.keywords)}</p>
        </div>
      )}
    </div>
  );
};

export default PoemContent;
