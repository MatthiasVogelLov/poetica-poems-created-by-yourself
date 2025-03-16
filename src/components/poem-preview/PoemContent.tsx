
import React from 'react';

interface PoemContentProps {
  poem: string;
}

const PoemContent: React.FC<PoemContentProps> = ({ poem }) => {
  return (
    <div className="poem-text mb-8 whitespace-pre-line text-center text-base sm:text-lg bg-gray-50 p-6 rounded-lg border border-gray-100">
      {poem}
    </div>
  );
};

export default PoemContent;
