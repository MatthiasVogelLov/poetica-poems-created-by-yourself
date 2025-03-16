
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="inline-block h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
      <p className="text-base sm:text-lg text-muted-foreground">Ihr Gedicht wird erstellt...</p>
    </div>
  );
};

export default LoadingIndicator;
