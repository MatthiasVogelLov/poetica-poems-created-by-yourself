
import React, { useEffect, useState } from 'react';
import PoemEditor from './PoemEditor';
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface PoemContentProps {
  poem: string;
  isPaid?: boolean;
  onPoemChange?: (updatedPoem: string) => void;
}

interface EditorPreferences {
  font: string;
  fontSize: string;
}

const PoemContent: React.FC<PoemContentProps> = ({ 
  poem, 
  isPaid = false,
  onPoemChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPoem, setCurrentPoem] = useState(poem);
  const [editorPreferences, setEditorPreferences] = useState<EditorPreferences>({
    font: 'serif',
    fontSize: 'text-base'
  });
  
  // Add debugging to help identify poem loading issues
  useEffect(() => {
    if (!poem) {
      console.log('Warning: Empty poem content received in PoemContent component');
    } else {
      console.log(`Poem content loaded successfully (${poem.length} characters)`);
      setCurrentPoem(poem);
    }
  }, [poem]);

  // Load saved preferences on component mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('poemEditorPreferences');
      if (savedPreferences) {
        setEditorPreferences(JSON.parse(savedPreferences));
      }
    } catch (e) {
      console.error('Error loading editor preferences:', e);
    }
  }, []);

  // Map font value to actual CSS font-family
  const getFontFamily = (fontValue: string) => {
    switch (fontValue) {
      case 'sans':
        return 'font-sans';
      case 'playfair':
        return 'font-serif'; // Using Playfair Display via font-serif
      case 'garamond':
        return 'font-["EB_Garamond",serif]';
      case 'georgia':
        return 'font-["Georgia",serif]';
      default:
        return 'font-serif';
    }
  };

  // If poem is empty or undefined, show a helpful error message
  if (!currentPoem || currentPoem.trim() === '') {
    return (
      <div className="poem-text mb-8 text-center text-base sm:text-lg bg-red-50 p-6 rounded-lg border border-red-100">
        <p className="text-red-500 font-medium">Das Gedicht konnte nicht geladen werden.</p>
        <p className="text-sm text-red-400 mt-2">
          Bitte versuchen Sie, die Seite neu zu laden oder kontaktieren Sie den Support.
        </p>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedPoem: string) => {
    setCurrentPoem(updatedPoem);
    setIsEditing(false);
    
    // Call the parent component's handler if provided
    if (onPoemChange) {
      onPoemChange(updatedPoem);
    }
    
    // Save to localStorage
    try {
      const poemData = localStorage.getItem('currentPoemData');
      if (poemData) {
        const parsedData = JSON.parse(poemData);
        parsedData.poem = updatedPoem;
        localStorage.setItem('currentPoemData', JSON.stringify(parsedData));
        console.log('Updated poem saved to localStorage');
      }
    } catch (e) {
      console.error('Error saving updated poem to localStorage:', e);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Show editor when in editing mode
  if (isEditing) {
    return (
      <div className="mb-8">
        <PoemEditor 
          initialPoem={currentPoem} 
          onSave={handleSave} 
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // Show poem content with edit button when paid
  return (
    <div className="poem-text mb-8 relative">
      {isPaid && (
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2" 
            onClick={handleEditClick}
          >
            <PenLine size={16} className="mr-1" />
            Bearbeiten
          </Button>
        </div>
      )}
      <div className={`whitespace-pre-line text-center ${getFontFamily(editorPreferences.font)} ${editorPreferences.fontSize} bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-inner`}>
        {currentPoem}
      </div>
    </div>
  );
};

export default PoemContent;
