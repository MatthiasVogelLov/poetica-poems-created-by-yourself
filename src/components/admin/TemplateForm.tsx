
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import BatchSelectField from './BatchSelectField';

interface TemplateFormData {
  count: number;
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords: string;
}

interface TemplateFormProps {
  templateData: TemplateFormData;
  onFieldChange: (field: string, value: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  templateData,
  onFieldChange,
  onGenerate,
  isGenerating
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Anzahl der Gedichte</label>
          <input 
            type="number" 
            value={templateData.count} 
            onChange={(e) => onFieldChange('count', parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Schlüsselwörter</label>
          <input 
            type="text" 
            value={templateData.keywords} 
            onChange={(e) => onFieldChange('keywords', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Komma-getrennte Keywords"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BatchSelectField
          label="Zielgruppe"
          options={[
            { value: 'eltern', label: 'Eltern' },
            { value: 'erwachsene', label: 'Erwachsene' },
            { value: 'familie', label: 'Familie' },
            { value: 'freunde', label: 'Freunde' },
            { value: 'kinder', label: 'Kinder' },
            { value: 'kollegen', label: 'Kollegen' },
            { value: 'partner', label: 'Partner' }
          ]}
          value={templateData.audience}
          onChange={(value) => onFieldChange('audience', value)}
        />
        
        <BatchSelectField
          label="Anlass"
          options={[
            { value: 'geburtstag', label: 'Geburtstag' },
            { value: 'hochzeit', label: 'Hochzeit' },
            { value: 'jubilaeum', label: 'Jubiläum' },
            { value: 'valentinstag', label: 'Valentinstag' },
            { value: 'weihnachten', label: 'Weihnachten' },
            { value: 'ostern', label: 'Ostern' },
            { value: 'andere', label: 'Andere' }
          ]}
          value={templateData.occasion}
          onChange={(value) => onFieldChange('occasion', value)}
        />
        
        <BatchSelectField
          label="Thema"
          options={[
            { value: 'liebe', label: 'Liebe' },
            { value: 'freundschaft', label: 'Freundschaft' },
            { value: 'natur', label: 'Natur' },
            { value: 'leben', label: 'Leben' },
            { value: 'motivation', label: 'Motivation' },
            { value: 'humor', label: 'Humor' },
            { value: 'trauer', label: 'Trauer' }
          ]}
          value={templateData.contentType}
          onChange={(value) => onFieldChange('contentType', value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BatchSelectField
          label="Stil"
          options={[
            { value: 'klassisch', label: 'Klassisch' },
            { value: 'modern', label: 'Modern' },
            { value: 'romantisch', label: 'Romantisch' },
            { value: 'humorvoll', label: 'Humorvoll' },
            { value: 'experimentell', label: 'Experimentell' }
          ]}
          value={templateData.style}
          onChange={(value) => onFieldChange('style', value)}
        />
        
        <BatchSelectField
          label="Reimschema"
          options={[
            { value: 'frei', label: 'Frei' },
            { value: 'paarreim', label: 'Paarreim' },
            { value: 'kreuzreim', label: 'Kreuzreim' },
            { value: 'umarmenderreim', label: 'Umarmender Reim' }
          ]}
          value={templateData.verseType}
          onChange={(value) => onFieldChange('verseType', value)}
        />
        
        <BatchSelectField
          label="Länge"
          options={[
            { value: 'mittel', label: 'Mittel' },
            { value: 'lang', label: 'Lang' }
          ]}
          value={templateData.length}
          onChange={(value) => onFieldChange('length', value)}
        />
      </div>
      
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="w-full mt-6"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {isGenerating ? 'Generiere Gedichte...' : `${templateData.count} Gedichte generieren`}
      </Button>
    </div>
  );
};

export default TemplateForm;
