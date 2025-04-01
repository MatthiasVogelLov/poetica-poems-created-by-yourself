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
  return <div className="w-full min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-700 via-gray-400 to-gray-100" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center text-white mb-16 mt-32">
            
            
          </div>
          
          {featuredPoem && <div className="mt-8 mb-24">
              <PoemOfTheDay poem={featuredPoem} onClick={() => onPoemClick(featuredPoem.id)} />
            </div>}
        </div>
      </div>
    </div>;
};
export default HeroSection;