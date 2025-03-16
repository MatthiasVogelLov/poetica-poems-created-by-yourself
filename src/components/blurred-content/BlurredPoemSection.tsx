
import React from 'react';

interface BlurredPoemSectionProps {
  children: React.ReactNode;
}

const BlurredPoemSection: React.FC<BlurredPoemSectionProps> = ({ children }) => {
  return (
    <div className="relative overflow-hidden" style={{ maxHeight: '150px' }}>
      <div className="blur-[5px] opacity-60 pointer-events-none">
        {children}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/90" />
    </div>
  );
};

export default BlurredPoemSection;
