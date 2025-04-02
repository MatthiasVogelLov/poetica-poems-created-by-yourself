
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
      {/* Background Image - covering the entire screen */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-[-1]"
        style={{ 
          backgroundImage: "url('/lovable-uploads/4803d3cc-49c3-40cc-9227-a8bdeee7703c.png')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Subtle overlay to ensure text readability */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[-1]" />
      
      <div className="relative pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* PoemsLand title positioned above the poem box */}
          <h1 className="text-4xl font-serif mb-10 text-white text-center">PoemsLand</h1>
          
          {featuredPoem && (
            <div className="flex justify-start">
              <div className="max-w-md">
                <PoemOfTheDay poem={featuredPoem} onClick={() => onPoemClick(featuredPoem.id)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
