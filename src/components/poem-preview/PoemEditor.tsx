
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PoemEditorProps {
  initialPoem: string;
  onSave: (updatedPoem: string) => void;
  onCancel: () => void;
}

// Font options
const fontOptions = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans-Serif' },
  { value: 'playfair', label: 'Playfair' },
  { value: 'garamond', label: 'Garamond' },
  { value: 'georgia', label: 'Georgia' },
];

// Font size options
const fontSizeOptions = [
  { value: 'text-base', label: 'Normal' },
  { value: 'text-lg', label: 'Größer' },
  { value: 'text-xl', label: 'Groß' },
  { value: 'text-2xl', label: 'Sehr Groß' },
  { value: 'text-3xl', label: 'Extra Groß' },
];

const PoemEditor: React.FC<PoemEditorProps> = ({ 
  initialPoem, 
  onSave, 
  onCancel 
}) => {
  const [editedPoem, setEditedPoem] = useState(initialPoem);
  const [selectedFont, setSelectedFont] = useState('serif');
  const [selectedFontSize, setSelectedFontSize] = useState('text-base');
  
  // Reset the editor content when the initial poem changes
  useEffect(() => {
    setEditedPoem(initialPoem);
  }, [initialPoem]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPoem(e.target.value);
  };

  const handleSave = () => {
    // Store font preferences in localStorage
    try {
      localStorage.setItem('poemEditorPreferences', JSON.stringify({
        font: selectedFont,
        fontSize: selectedFontSize
      }));
    } catch (e) {
      console.error('Error saving editor preferences:', e);
    }
    
    onSave(editedPoem);
  };
  
  // Load saved preferences on component mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('poemEditorPreferences');
      if (savedPreferences) {
        const { font, fontSize } = JSON.parse(savedPreferences);
        setSelectedFont(font || 'serif');
        setSelectedFontSize(fontSize || 'text-base');
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-primary gap-1">
          <PenLine size={18} />
          <span className="font-medium">Gedicht bearbeiten</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
          >
            <X size={16} className="mr-1" />
            Abbrechen
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
          >
            <Save size={16} className="mr-1" />
            Speichern
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
      </div>
      
      <Textarea
        value={editedPoem}
        onChange={handleChange}
        className={`min-h-[300px] whitespace-pre-line bg-gray-50 text-center ${getFontFamily(selectedFont)} ${selectedFontSize}`}
        placeholder="Gedicht bearbeiten..."
      />
      
      <div className="mt-2 text-xs text-gray-500">
        Tipp: Änderungen werden automatisch mit deinen Einstellungen gespeichert.
      </div>
    </div>
  );
};

export default PoemEditor;
