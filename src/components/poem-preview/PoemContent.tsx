
import React, { useEffect } from 'react';

interface PoemContentProps {
  poem: string;
}

const PoemContent: React.FC<PoemContentProps> = ({ poem }) => {
  // Add debugging to help identify poem loading issues
  useEffect(() => {
    if (!poem) {
      console.log('Warning: Empty poem content received in PoemContent component');
    } else {
      console.log(`Poem content loaded successfully (${poem.length} characters)`);
    }
  }, [poem]);

  // If poem is empty or undefined, show a helpful error message
  if (!poem || poem.trim() === '') {
    return (
      <div className="poem-text mb-8 text-center text-base sm:text-lg bg-red-50 p-6 rounded-lg border border-red-100">
        <p className="text-red-500 font-medium">Das Gedicht konnte nicht geladen werden.</p>
        <p className="text-sm text-red-400 mt-2">
          Bitte versuchen Sie, die Seite neu zu laden oder kontaktieren Sie den Support.
        </p>
      </div>
    );
  }

  return (
    <div className="poem-text mb-8 whitespace-pre-line text-center text-base sm:text-lg bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-inner">
      {poem}
    </div>
  );
};

export default PoemContent;
