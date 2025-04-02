
import React from 'react';
import PoemOfTheDay from './PoemOfTheDay';
import { Poem } from '@/types/poem-types';

interface HeroSectionProps {
  featuredPoem: Poem | null;
  onPoemClick: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  featuredPoem,
  onPoemClick
}) => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/117a5233-568a-486e-a0f8-5eb29bb26d0e.png')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center text-white mb-28 mt-48">
            {/* Space for PoemsLand title, handled by Header component */}
          </div>
          
          {featuredPoem && (
            <div className="mt-8 mb-24">
              <PoemOfTheDay poem={featuredPoem} onClick={() => onPoemClick(featuredPoem.id)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
