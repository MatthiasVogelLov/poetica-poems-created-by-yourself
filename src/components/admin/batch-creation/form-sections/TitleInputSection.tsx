
import React from 'react';

interface TitleInputSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
}

const TitleInputSection: React.FC<TitleInputSectionProps> = ({ title, onTitleChange }) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Titel</label>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Gedichttitel"
      />
    </div>
  );
};

export default TitleInputSection;
