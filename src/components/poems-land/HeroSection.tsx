
import React from 'react';
import PoemOfTheDay from './PoemOfTheDay';
import { Poem } from '@/types/poem-types';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  featuredPoem: Poem | null;
  onPoemClick: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  featuredPoem,
  onPoemClick
}) => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Background Image with higher z-index to ensure it's visible */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-[-1]"
        style={{ 
          backgroundImage: "url('/lovable-uploads/d089299f-d136-40eb-a6eb-b67e71aa4671.png')", 
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
          <h1 className="text-4xl font-serif mb-10 text-white text-center drop-shadow-md">PoemsLand</h1>
          
          {featuredPoem && (
            <div className="flex justify-start">
              <div className="max-w-md">
                <PoemOfTheDay poem={featuredPoem} onClick={() => onPoemClick(featuredPoem.id)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll down arrow */}
      <div 
        className="absolute bottom-10 left-10 animate-bounce cursor-pointer"
        onClick={scrollToContent}
      >
        <ArrowDown size={36} className="text-white drop-shadow-lg" />
      </div>
    </div>
  );
};

export default HeroSection;
