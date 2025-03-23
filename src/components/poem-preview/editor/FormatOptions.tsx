
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  fontOptions, 
  fontSizeOptions, 
  textColorOptions, 
  backgroundColorOptions 
} from './editorOptions';
import { EditorPreferences } from './types';

interface FormatOptionsProps {
  preferences: EditorPreferences;
  onPreferenceChange: (key: keyof EditorPreferences, value: string) => void;
}

const FormatOptions: React.FC<FormatOptionsProps> = ({ 
  preferences,
  onPreferenceChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-sm font-medium mb-1 block text-gray-700">Schriftart</label>
        <Select 
          value={preferences.font} 
          onValueChange={(value) => onPreferenceChange('font', value)}
        >
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
        <Select 
          value={preferences.fontSize} 
          onValueChange={(value) => onPreferenceChange('fontSize', value)}
        >
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
        <Select 
          value={preferences.textColor} 
          onValueChange={(value) => onPreferenceChange('textColor', value)}
        >
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
        <Select 
          value={preferences.backgroundColor} 
          onValueChange={(value) => onPreferenceChange('backgroundColor', value)}
        >
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
  );
};

export default FormatOptions;
