
import React, { useEffect } from 'react';
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

  // Force background image reload on component mount
  useEffect(() => {
    const img = new Image();
    img.src = '/lovable-uploads/6169c2b0-b024-4ab5-919e-049befc3844b.png';
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-[-1]"
        style={{ 
          backgroundImage: "url('/lovable-uploads/6169c2b0-b024-4ab5-919e-049befc3844b.png')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Very subtle overlay to ensure text readability */}
      <div className="fixed inset-0 bg-black/10 z-[-1]" />
      
      <div className="relative pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* PoemsLand title positioned above the poem box with dark text */}
          <h1 className="text-4xl font-serif mb-10 text-black font-bold text-center text-shadow-sm">PoemsLand</h1>
          
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
