
import { type EditorPreferences } from './types';

// Font options with more distinctive choices
export const fontOptions = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans-Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' },
];

// Font size options
export const fontSizeOptions = [
  { value: 'text-base', label: 'Normal' },
  { value: 'text-lg', label: 'Größer' },
  { value: 'text-xl', label: 'Groß' },
  { value: 'text-2xl', label: 'Sehr Groß' },
  { value: 'text-3xl', label: 'Extra Groß' },
];

// Text color options
export const textColorOptions = [
  { value: 'text-black', label: 'Schwarz' },
  { value: 'text-gray-700', label: 'Dunkelgrau' },
  { value: 'text-blue-700', label: 'Blau' },
  { value: 'text-green-700', label: 'Grün' },
  { value: 'text-purple-700', label: 'Lila' },
];

// Background color options
export const backgroundColorOptions = [
  { value: 'bg-gray-50', label: 'Hellgrau' },
  { value: 'bg-white', label: 'Weiß' },
  { value: 'bg-blue-50', label: 'Hellblau' },
  { value: 'bg-green-50', label: 'Hellgrün' },
  { value: 'bg-purple-50', label: 'Helllila' },
];

// Map font value to actual CSS font-family
export const getFontFamily = (fontValue: string) => {
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
