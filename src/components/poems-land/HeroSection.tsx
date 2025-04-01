
import React from 'react';
import PoemOfTheDay from './PoemOfTheDay';
import { Poem } from '@/types/poem-types';

interface HeroSectionProps {
  featuredPoem: Poem | null;
  onPoemClick: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredPoem, onPoemClick }) => {
  return (
    <div className="w-full h-[70vh] mb-16 relative overflow-hidden rounded-xl shadow-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('/lovable-uploads/adcdecab-321c-4ffc-89c4-4e1969fa1fa4.png')", 
          filter: "brightness(0.7)" 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">
              Entdecke deine poetische Welt
            </h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              Eine Sammlung einzigartiger Gedichte für jeden Anlass
            </p>
          </div>
          
          {featuredPoem && (
            <div className="mt-12">
              <PoemOfTheDay 
                poem={featuredPoem} 
                onClick={() => onPoemClick(featuredPoem.id)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
