
import React from 'react';

interface KeywordsSectionProps {
  keywords: string;
  onKeywordsChange: (value: string) => void;
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({ keywords, onKeywordsChange }) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Schlüsselwörter (optional)</label>
      <input
        type="text"
        value={keywords}
        onChange={(e) => onKeywordsChange(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Schlüsselwörter durch Komma getrennt"
      />
      <p className="text-xs text-gray-500">
        Hinweis: Nomen werden automatisch großgeschrieben und am Ende des Gedichts aufgelistet.
      </p>
    </div>
  );
};

export default KeywordsSection;
