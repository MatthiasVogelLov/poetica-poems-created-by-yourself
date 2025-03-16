
import React from 'react';

interface PoemTitleProps {
  title: string;
}

const PoemTitle: React.FC<PoemTitleProps> = ({ title }) => {
  return (
    <div className="relative mb-6 text-center">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200" aria-hidden="true"></div>
      <h2 className="relative inline-block px-4 bg-white text-xl sm:text-2xl font-serif text-center z-10">
        {title}
      </h2>
    </div>
  );
};

export default PoemTitle;
