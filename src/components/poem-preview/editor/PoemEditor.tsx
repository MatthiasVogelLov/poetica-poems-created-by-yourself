
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { EditorPreferences } from './types';
import { useEditorPreferences } from './useEditorPreferences';
import { getFontFamily } from './editorOptions';
import EditorControls from './EditorControls';
import FormatOptions from './FormatOptions';

interface PoemEditorProps {
  initialPoem: string;
  onSave: (updatedPoem: string, preferences: EditorPreferences) => void;
  onCancel: () => void;
}

const PoemEditor: React.FC<PoemEditorProps> = ({ 
  initialPoem, 
  onSave, 
  onCancel 
}) => {
  const [editedPoem, setEditedPoem] = useState(initialPoem);
  const { 
    preferences, 
    updatePreferences, 
    resetPreferences, 
    savePreferences 
  } = useEditorPreferences();
  
  // Reset the editor content when the initial poem changes
  useEffect(() => {
    setEditedPoem(initialPoem);
  }, [initialPoem]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPoem(e.target.value);
  };

  const handlePreferenceChange = (key: keyof EditorPreferences, value: string) => {
    updatePreferences({ [key]: value });
  };

  const handleSave = () => {
    // Save preferences and pass both poem and preferences to parent component
    const savedPreferences = savePreferences();
    onSave(editedPoem, savedPreferences);
  };

  const handleReset = () => {
    // Reset poem to initial state
    setEditedPoem(initialPoem);
    // Reset preferences to defaults
    resetPreferences();
  };

  return (
    <div className="space-y-4">
      <EditorControls 
        onSave={handleSave}
        onCancel={onCancel}
        onReset={handleReset}
      />
      
      <FormatOptions 
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
      />
      
      <Textarea
        value={editedPoem}
        onChange={handleChange}
        className={`min-h-[300px] whitespace-pre-line text-center ${getFontFamily(preferences.font)} ${preferences.fontSize} ${preferences.textColor} ${preferences.backgroundColor}`}
        placeholder="Gedicht bearbeiten..."
      />
      
      <div className="mt-2 text-xs text-gray-500">
        Tipp: Änderungen werden automatisch mit deinen Einstellungen gespeichert.
      </div>
    </div>
  );
};

export default PoemEditor;
