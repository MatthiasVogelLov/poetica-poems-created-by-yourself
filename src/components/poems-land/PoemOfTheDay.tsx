
import React, { useEffect, useRef, useState } from 'react';
import { Poem } from '@/types/poem-types';
import { Star } from 'lucide-react';

interface PoemOfTheDayProps {
  poem: Poem;
  onClick: () => void;
}

const PoemOfTheDay: React.FC<PoemOfTheDayProps> = ({ poem, onClick }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
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

  useEffect(() => {
    if (contentRef.current) {
      const contentElement = contentRef.current;
      setContentHeight(contentElement.scrollHeight);
      setContainerHeight(contentElement.clientHeight);
      
      // Determine if the content needs scrolling
      const needsScrolling = contentElement.scrollHeight > contentElement.clientHeight;
      
      if (needsScrolling) {
        // Start scrolling after a delay
        const timer = setTimeout(() => {
          setShouldScroll(true);
        }, 3000); // 3 seconds delay
        
        return () => clearTimeout(timer);
      }
    }
  }, [poem.content]);

  useEffect(() => {
    if (shouldScroll && contentRef.current && contentHeight > containerHeight) {
      const contentElement = contentRef.current;
      let startTime: number | null = null;
      const scrollDuration = Math.max(contentHeight * 30, 15000); // Adjust scroll speed based on content length
      
      const scrollAnimation = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        const scrollProgress = Math.min(elapsed / scrollDuration, 1);
        const scrollPosition = scrollProgress * (contentHeight - containerHeight);
        
        if (contentElement) {
          contentElement.scrollTop = scrollPosition;
        }
        
        if (scrollProgress < 1) {
          requestAnimationFrame(scrollAnimation);
        } else {
          // Reset to top and start over
          if (contentElement) contentElement.scrollTop = 0;
          startTime = null;
          requestAnimationFrame(scrollAnimation);
        }
      };
      
      const animationFrame = requestAnimationFrame(scrollAnimation);
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [shouldScroll, contentHeight, containerHeight]);
  
  return (
    <div 
      className="p-6 md:p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-lg"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <h3 className="text-lg font-medium">Gedicht des Tages</h3>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-serif font-medium mb-5 text-white">{poem.title}</h2>
      
      <div 
        ref={contentRef}
        className="text-black leading-relaxed font-serif text-lg max-h-[250px] overflow-hidden"
      >
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
