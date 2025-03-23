
// Email formatting utilities for notify-poem function

/**
 * Maps font preference values to CSS font-family properties
 */
export function getFontFamily(fontValue: string): string {
  switch (fontValue) {
    case 'sans':
      return 'font-family: Arial, Helvetica, sans-serif;';
    case 'mono':
      return 'font-family: "Courier New", Courier, monospace;';
    case 'cursive':
      return 'font-family: "Brush Script MT", cursive;';
    case 'fantasy':
      return 'font-family: "Copperplate", fantasy;';
    default:
      return 'font-family: Georgia, "Times New Roman", serif;';
  }
}

/**
 * Maps font size preference values to CSS font-size properties
 */
export function getFontSize(sizeValue: string): string {
  switch (sizeValue) {
    case 'text-lg':
      return 'font-size: 18px;';
    case 'text-xl':
      return 'font-size: 20px;';
    case 'text-2xl':
      return 'font-size: 24px;';
    case 'text-3xl':
      return 'font-size: 30px;';
    default:
      return 'font-size: 16px;';
  }
}

/**
 * Maps text color preference values to CSS color properties
 */
export function getTextColor(colorValue: string): string {
  switch (colorValue) {
    case 'text-gray-700':
      return 'color: #374151;';
    case 'text-blue-700':
      return 'color: #1d4ed8;';
    case 'text-green-700':
      return 'color: #15803d;';
    case 'text-purple-700':
      return 'color: #7e22ce;';
    default:
      return 'color: #000000;';
  }
}

/**
 * Maps background color preference values to CSS background-color properties
 */
export function getBackgroundColor(bgValue: string): string {
  switch (bgValue) {
    case 'bg-white':
      return 'background-color: #ffffff;';
    case 'bg-blue-50':
      return 'background-color: #eff6ff;';
    case 'bg-green-50':
      return 'background-color: #f0fdf4;';
    case 'bg-purple-50':
      return 'background-color: #faf5ff;';
    default:
      return 'background-color: #f9fafb;'; // gray-50
  }
}

/**
 * Get human-readable font name
 */
export function getReadableFontName(fontValue: string): string {
  switch (fontValue) {
    case 'sans': return 'Sans-Serif';
    case 'mono': return 'Monospace';
    case 'cursive': return 'Cursive';
    case 'fantasy': return 'Fantasy';
    default: return 'Serif';
  }
}

/**
 * Get human-readable font size
 */
export function getReadableFontSize(sizeValue: string): string {
  switch (sizeValue) {
    case 'text-lg': return 'Größer';
    case 'text-xl': return 'Groß';
    case 'text-2xl': return 'Sehr Groß';
    case 'text-3xl': return 'Extra Groß';
    default: return 'Normal';
  }
}

/**
 * Get human-readable text color
 */
export function getReadableTextColor(colorValue: string): string {
  switch (colorValue) {
    case 'text-gray-700': return 'Dunkelgrau';
    case 'text-blue-700': return 'Blau';
    case 'text-green-700': return 'Grün';
    case 'text-purple-700': return 'Lila';
    default: return 'Schwarz';
  }
}

/**
 * Get human-readable background color
 */
export function getReadableBackgroundColor(bgValue: string): string {
  switch (bgValue) {
    case 'bg-white': return 'Weiß';
    case 'bg-blue-50': return 'Hellblau';
    case 'bg-green-50': return 'Hellgrün';
    case 'bg-purple-50': return 'Helllila';
    default: return 'Hellgrau';
  }
}

/**
 * Format editor preferences for display in email
 */
export function formatEditorPreferencesHtml(editorPreferences: any): string {
  if (!editorPreferences) {
    return '<span>Standard</span>';
  }
  
  return `
    <div style="margin-top: 8px;">
      <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
        <strong>Schriftart:</strong> ${getReadableFontName(editorPreferences.font)}
      </div>
      <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
        <strong>Größe:</strong> ${getReadableFontSize(editorPreferences.fontSize)}
      </div>
      <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
        <strong>Textfarbe:</strong> ${getReadableTextColor(editorPreferences.textColor)}
      </div>
      <div style="display: inline-block; padding: 4px 8px; margin-right: 6px; background-color: #f0f0f0; border-radius: 4px;">
        <strong>Hintergrund:</strong> ${getReadableBackgroundColor(editorPreferences.backgroundColor)}
      </div>
    </div>
  `;
}

/**
 * Generate CSS style for poem based on editor preferences
 */
export function getPoemStyle(editorPreferences: any): string {
  if (!editorPreferences) {
    return `
      font-family: Georgia, "Times New Roman", serif;
      font-size: 16px;
      color: #000000;
      background-color: #f9fafb;
      line-height: 1.8;
      text-align: center;
      padding: 20px;
      border-radius: 5px;
    `;
  }
  
  return `
    ${getFontFamily(editorPreferences.font)}
    ${getFontSize(editorPreferences.fontSize)}
    ${getTextColor(editorPreferences.textColor)}
    ${getBackgroundColor(editorPreferences.backgroundColor)}
    line-height: 1.8;
    text-align: center;
    padding: 20px;
    border-radius: 5px;
  `;
}

/**
 * Format keywords section for email
 */
export function formatKeywordsHtml(keywords: string): string {
  const keywordsArray = keywords.split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);
    
  if (keywordsArray.length > 0) {
    return `
      <div style="margin-top: 20px;">
        <h3 style="color: #1d3557; margin-bottom: 10px;">Benutzer-Schlüsselwörter:</h3>
        <ul style="background-color: #fff9db; padding: 12px 24px; border-radius: 5px; border-left: 4px solid #fcc419;">
          ${keywordsArray.map(word => `<li style="margin-bottom: 6px;"><strong>${word}</strong></li>`).join('')}
        </ul>
      </div>`;
  }
  
  return `<div style="margin-top: 20px;">
    <h3 style="color: #1d3557; margin-bottom: 10px;">Benutzer-Schlüsselwörter:</h3>
    <p style="font-style: italic; color: #666;">Keine Schlüsselwörter vom Benutzer angegeben</p>
  </div>`;
}
