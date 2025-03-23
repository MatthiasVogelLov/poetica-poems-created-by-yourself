
import { useState, useEffect } from 'react';
import { EditorPreferences, defaultPreferences } from './types';

export function useEditorPreferences(initialPreferences?: Partial<EditorPreferences>) {
  const [preferences, setPreferences] = useState<EditorPreferences>({
    ...defaultPreferences,
    ...initialPreferences
  });

  // Load saved preferences on component mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('poemEditorPreferences');
      if (savedPreferences) {
        setPreferences({
          ...JSON.parse(savedPreferences),
          ...initialPreferences
        });
        console.log('Loaded editor preferences:', JSON.parse(savedPreferences));
      }
    } catch (e) {
      console.error('Error loading editor preferences:', e);
    }
  }, [initialPreferences]);

  const updatePreferences = (newPreferences: Partial<EditorPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      // Save immediately when preferences are updated
      try {
        localStorage.setItem('poemEditorPreferences', JSON.stringify(updated));
      } catch (e) {
        console.error('Error auto-saving editor preferences:', e);
      }
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    try {
      localStorage.setItem('poemEditorPreferences', JSON.stringify(defaultPreferences));
      console.log('Reset editor preferences to defaults');
    } catch (e) {
      console.error('Error resetting editor preferences:', e);
    }
  };

  const savePreferences = () => {
    try {
      localStorage.setItem('poemEditorPreferences', JSON.stringify(preferences));
      console.log('Saved editor preferences:', preferences);
    } catch (e) {
      console.error('Error saving editor preferences:', e);
    }
    return preferences;
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    savePreferences
  };
}
