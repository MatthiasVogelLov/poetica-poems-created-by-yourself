
import React from 'react';
import { Poem } from '@/types/poem-types';
import { CalendarDays, Star } from 'lucide-react';

interface PoemOfTheDayProps {
  poem: Poem;
  onClick: () => void;
}

const PoemOfTheDay: React.FC<PoemOfTheDayProps> = ({ poem, onClick }) => {
  // Get a short excerpt from the poem content (first 150 characters)
  const excerpt = poem.content.substring(0, 150) + (poem.content.length > 150 ? '...' : '');
  
  return (
    <div 
      className="glass-card p-6 md:p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <h3 className="text-lg font-medium text-white">Gedicht des Tages</h3>
        </div>
        <div className="flex items-center gap-1 text-white/70 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-serif font-medium mb-3 text-white">{poem.title}</h2>
      
      <p className="text-white/90 leading-relaxed font-serif italic text-lg">{excerpt}</p>
      
      <div className="flex flex-wrap mt-4 gap-2">
        <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
          Zum vollständigen Gedicht
        </span>
      </div>
    </div>
  );
};

export default PoemOfTheDay;
