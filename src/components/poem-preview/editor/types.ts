
// Define editor preferences type
export interface EditorPreferences {
  font: string;
  fontSize: string;
  textColor: string;
  backgroundColor: string;
}

// Default preferences
export const defaultPreferences: EditorPreferences = {
  font: 'serif',
  fontSize: 'text-base',
  textColor: 'text-black',
  backgroundColor: 'bg-gray-50'
};
