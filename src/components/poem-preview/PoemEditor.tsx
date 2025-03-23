
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, X, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';

interface PoemEditorProps {
  initialPoem: string;
  onSave: (updatedPoem: string, preferences: EditorPreferences) => void;
  onCancel: () => void;
}

// Define editor preferences type
export interface EditorPreferences {
  font: string;
  fontSize: string;
  textColor: string;
  backgroundColor: string;
}

// Font options with more distinctive choices
const fontOptions = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans-Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' },
];

// Font size options
const fontSizeOptions = [
  { value: 'text-base', label: 'Normal' },
  { value: 'text-lg', label: 'Größer' },
  { value: 'text-xl', label: 'Groß' },
  { value: 'text-2xl', label: 'Sehr Groß' },
  { value: 'text-3xl', label: 'Extra Groß' },
];

// Text color options
const textColorOptions = [
  { value: 'text-black', label: 'Schwarz' },
  { value: 'text-gray-700', label: 'Dunkelgrau' },
  { value: 'text-blue-700', label: 'Blau' },
  { value: 'text-green-700', label: 'Grün' },
  { value: 'text-purple-700', label: 'Lila' },
];

// Background color options
const backgroundColorOptions = [
  { value: 'bg-gray-50', label: 'Hellgrau' },
  { value: 'bg-white', label: 'Weiß' },
  { value: 'bg-blue-50', label: 'Hellblau' },
  { value: 'bg-green-50', label: 'Hellgrün' },
  { value: 'bg-purple-50', label: 'Helllila' },
];

// Default preferences
const defaultPreferences: EditorPreferences = {
  font: 'serif',
  fontSize: 'text-base',
  textColor: 'text-black',
  backgroundColor: 'bg-gray-50'
};

const PoemEditor: React.FC<PoemEditorProps> = ({ 
  initialPoem, 
  onSave, 
  onCancel 
}) => {
  const [editedPoem, setEditedPoem] = useState(initialPoem);
  const [selectedFont, setSelectedFont] = useState('serif');
  const [selectedFontSize, setSelectedFontSize] = useState('text-base');
  const [selectedTextColor, setSelectedTextColor] = useState('text-black');
  const [selectedBgColor, setSelectedBgColor] = useState('bg-gray-50');
  const isMobile = useIsMobile();
  
  // Reset the editor content when the initial poem changes
  useEffect(() => {
    setEditedPoem(initialPoem);
  }, [initialPoem]);

  // Load saved preferences on component mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('poemEditorPreferences');
      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences);
        setSelectedFont(prefs.font || 'serif');
        setSelectedFontSize(prefs.fontSize || 'text-base');
        setSelectedTextColor(prefs.textColor || 'text-black');
        setSelectedBgColor(prefs.backgroundColor || 'bg-gray-50');
      }
    } catch (e) {
      console.error('Error loading editor preferences:', e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPoem(e.target.value);
  };

  const handleSave = () => {
    // Create preferences object
    const preferences: EditorPreferences = {
      font: selectedFont,
      fontSize: selectedFontSize,
      textColor: selectedTextColor,
      backgroundColor: selectedBgColor
    };
    
    // Store preferences in localStorage
    try {
      localStorage.setItem('poemEditorPreferences', JSON.stringify(preferences));
      console.log('Saved editor preferences:', preferences);
    } catch (e) {
      console.error('Error saving editor preferences:', e);
    }
    
    // Pass both poem and preferences to parent component
    onSave(editedPoem, preferences);
  };

  const handleReset = () => {
    // Reset poem to initial state
    setEditedPoem(initialPoem);
    
    // Reset preferences to defaults
    setSelectedFont(defaultPreferences.font);
    setSelectedFontSize(defaultPreferences.fontSize);
    setSelectedTextColor(defaultPreferences.textColor);
    setSelectedBgColor(defaultPreferences.backgroundColor);
    
    // Clear saved preferences in localStorage
    try {
      localStorage.setItem('poemEditorPreferences', JSON.stringify(defaultPreferences));
      console.log('Reset editor preferences to defaults');
    } catch (e) {
      console.error('Error resetting editor preferences:', e);
    }
  };

  // Map font value to actual CSS font-family
  const getFontFamily = (fontValue: string) => {
    switch (fontValue) {
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
      case 'cursive':
        return 'font-["Brush_Script_MT",cursive]';
      case 'fantasy':
        return 'font-["Copperplate",fantasy]';
      default:
        return 'font-serif';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-primary gap-1">
          <PenLine size={18} />
          <span className={isMobile ? "sr-only" : "font-medium"}>Gedicht bearbeiten</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            title="Zurücksetzen"
          >
            <RefreshCw size={16} />
            {!isMobile && <span className="ml-1">Zurücksetzen</span>}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            title="Abbrechen"
          >
            <X size={16} />
            {!isMobile && <span className="ml-1">Abbrechen</span>}
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            title="Speichern"
          >
            <Save size={16} />
            {!isMobile && <span className="ml-1">Speichern</span>}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">Schriftart</label>
          <Select value={selectedFont} onValueChange={setSelectedFont}>
            <SelectTrigger>
              <SelectValue placeholder="Schriftart wählen" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">Schriftgröße</label>
          <Select value={selectedFontSize} onValueChange={setSelectedFontSize}>
            <SelectTrigger>
              <SelectValue placeholder="Größe wählen" />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">Textfarbe</label>
          <Select value={selectedTextColor} onValueChange={setSelectedTextColor}>
            <SelectTrigger>
              <SelectValue placeholder="Textfarbe wählen" />
            </SelectTrigger>
            <SelectContent>
              {textColorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">Hintergrund</label>
          <Select value={selectedBgColor} onValueChange={setSelectedBgColor}>
            <SelectTrigger>
              <SelectValue placeholder="Hintergrund wählen" />
            </SelectTrigger>
            <SelectContent>
              {backgroundColorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Textarea
        value={editedPoem}
        onChange={handleChange}
        className={`min-h-[300px] whitespace-pre-line text-center ${getFontFamily(selectedFont)} ${selectedFontSize} ${selectedTextColor} ${selectedBgColor}`}
        placeholder="Gedicht bearbeiten..."
      />
      
      <div className="mt-2 text-xs text-gray-500">
        Tipp: Änderungen werden automatisch mit deinen Einstellungen gespeichert.
      </div>
    </div>
  );
};

export default PoemEditor;
