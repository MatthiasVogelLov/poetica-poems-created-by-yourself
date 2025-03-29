
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import PoemEditor from './editor/PoemEditor';
import { EditorPreferences } from './editor/types';
import { getFontFamily } from './editor/editorOptions';
import { supabase } from "@/integrations/supabase/client";

interface PoemContentProps {
  poem: string;
  isPaid?: boolean;
  onPoemChange?: (updatedPoem: string) => void;
  isInPoemsLand?: boolean;
}

const PoemContent: React.FC<PoemContentProps> = ({ 
  poem, 
  isPaid = false,
  onPoemChange,
  isInPoemsLand = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPoem, setCurrentPoem] = useState(poem);
  const [editorPreferences, setEditorPreferences] = useState<EditorPreferences>({
    font: 'serif',
    fontSize: 'text-base',
    textColor: 'text-black',
    backgroundColor: 'bg-gray-50'
  });
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!poem) {
      console.log('Warning: Empty poem content received in PoemContent component');
    } else {
      console.log(`Poem content loaded successfully (${poem.length} characters)`);
      setCurrentPoem(poem);
    }
  }, [poem]);

  useEffect(() => {
    try {
      // Only load saved preferences if this is NOT in PoemsLand
      if (!isInPoemsLand) {
        const savedPreferences = localStorage.getItem('poemEditorPreferences');
        if (savedPreferences) {
          const parsedPrefs = JSON.parse(savedPreferences);
          setEditorPreferences(parsedPrefs);
          console.log('Loaded editor preferences:', parsedPrefs);
          
          // Send editor preferences to the server for the admin copy email
          if (isPaid && poem) {
            try {
              const poemData = localStorage.getItem('currentPoemData');
              if (poemData) {
                const parsedData = JSON.parse(poemData);
                const { poemTitle, formData } = parsedData;
                
                if (poemTitle && formData) {
                  console.log('Notifying admin about poem with editor preferences');
                  supabase.functions.invoke('notify-poem', {
                    body: {
                      poemTitle,
                      formData,
                      poemContent: poem,
                      editorPreferences: parsedPrefs
                    }
                  }).catch(err => {
                    console.error('Error notifying admin about poem:', err);
                  });
                }
              }
            } catch (e) {
              console.error('Error sending poem notification with preferences:', e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading editor preferences:', e);
    }
  }, [isPaid, poem, isInPoemsLand]);

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

  const handleSave = (updatedPoem: string, preferences: EditorPreferences) => {
    setCurrentPoem(updatedPoem);
    setEditorPreferences(preferences);
    setIsEditing(false);
    
    console.log('Saving poem with preferences:', preferences);
    
    if (onPoemChange) {
      onPoemChange(updatedPoem);
    }
    
    try {
      const poemData = localStorage.getItem('currentPoemData');
      if (poemData) {
        const parsedData = JSON.parse(poemData);
        parsedData.poem = updatedPoem;
        localStorage.setItem('currentPoemData', JSON.stringify(parsedData));
        console.log('Updated poem saved to localStorage');
        
        // Send notification with updated poem and preferences
        if (isPaid) {
          console.log('Notifying admin about updated poem with editor preferences');
          supabase.functions.invoke('notify-poem', {
            body: {
              poemTitle: parsedData.poemTitle,
              formData: parsedData.formData,
              poemContent: updatedPoem,
              editorPreferences: preferences
            }
          }).catch(err => {
            console.error('Error notifying admin about updated poem:', err);
          });
        }
      }
    } catch (e) {
      console.error('Error saving updated poem to localStorage:', e);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

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

  // Format the poem for SEO-friendly display with proper semantic markup
  const formattedPoem = currentPoem.split('\n').map((line, i) => 
    line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
  );

  return (
    <div className="poem-text mb-8 relative poem-container">
      {isPaid && !isInPoemsLand && (
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2" 
            onClick={handleEditClick}
            title="Bearbeiten"
          >
            <PenLine size={16} />
            <span className={isMobile ? "sr-only" : ""}>Bearbeiten</span>
          </Button>
        </div>
      )}
      <div 
        className={`whitespace-pre-line text-center ${getFontFamily(editorPreferences.font)} ${editorPreferences.fontSize} ${editorPreferences.textColor} ${editorPreferences.backgroundColor} p-6 rounded-lg border border-gray-100 shadow-inner`}
        itemScope
        itemType="https://schema.org/Poem"
      >
        {isInPoemsLand && <meta itemProp="text" content={currentPoem} />}
        <div className="poem-content">
          {isInPoemsLand ? formattedPoem : currentPoem}
        </div>
      </div>
    </div>
  );
};

export default PoemContent;
