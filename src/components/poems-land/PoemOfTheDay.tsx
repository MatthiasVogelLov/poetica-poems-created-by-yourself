
import React from 'react';
import { Poem } from '@/types/poem-types';
import { Star } from 'lucide-react';

interface PoemOfTheDayProps {
  poem: Poem;
  onClick: () => void;
}

const PoemOfTheDay: React.FC<PoemOfTheDayProps> = ({ poem, onClick }) => {
  // Format the poem content to preserve stanza structure
  const formatPoemContent = (content: string) => {
    // Split the content by double line breaks (stanzas)
    const stanzas = content.split(/\n\n+/);
    
    return (
      <div className="poem-content font-serif">
        {stanzas.map((stanza, stanzaIndex) => (
          <div key={stanzaIndex} className="mb-6">
            {/* Split each stanza into lines */}
            {stanza.split('\n').map((line, lineIndex) => (
              <div key={lineIndex} className="leading-relaxed">
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className="glass-card p-6 md:p-8 rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-white/10 backdrop-blur-sm shadow-lg text-white"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <h3 className="text-lg font-medium">Gedicht des Tages</h3>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-serif font-medium mb-5 text-white">{poem.title}</h2>
      
      <div className="text-white/90 leading-relaxed font-serif text-lg">
        {formatPoemContent(poem.content)}
      </div>
      
      <div className="flex flex-wrap mt-6 gap-2">
        <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
          Zum vollständigen Gedicht
        </span>
      </div>
    </div>
  );
};

export default PoemOfTheDay;
