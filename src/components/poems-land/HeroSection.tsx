
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
      {/* Background Image with the new uploaded image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-[-1]"
        style={{ 
          backgroundImage: "url('/lovable-uploads/e0b2a410-58c0-48b2-b6e0-1904424475f6.png')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Very subtle overlay to ensure text readability */}
      <div className="fixed inset-0 bg-black/5 z-[-1]" />
      
      <div className="relative pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* PoemsLand title positioned above the poem box with dark text */}
          <h1 className="text-4xl font-serif mb-10 text-black font-bold text-center">PoemsLand</h1>
          
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
        <ArrowDown size={36} className="text-black" />
      </div>
    </div>
  );
};

export default HeroSection;
