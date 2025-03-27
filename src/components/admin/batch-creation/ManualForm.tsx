
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import BatchSelectField from '../BatchSelectField';

interface ManualPoemData {
  title: string;
  content: string;
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords?: string;
}

interface ManualFormProps {
  poemData: ManualPoemData;
  onFieldChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

const ManualForm: React.FC<ManualFormProps> = ({
  poemData,
  onFieldChange,
  onSubmit
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Titel</label>
        <input 
          type="text" 
          value={poemData.title} 
          onChange={(e) => onFieldChange('title', e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Gedichttitel"
        />
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
          value={poemData.audience}
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
          value={poemData.occasion}
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
          value={poemData.contentType}
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
          value={poemData.style}
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
          value={poemData.verseType}
          onChange={(value) => onFieldChange('verseType', value)}
        />
        
        <BatchSelectField
          label="Länge"
          options={[
            { value: 'mittel', label: 'Mittel' },
            { value: 'lang', label: 'Lang' }
          ]}
          value={poemData.length}
          onChange={(value) => onFieldChange('length', value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">Schlüsselwörter (optional)</label>
        <input
          type="text"
          value={poemData.keywords || ''}
          onChange={(e) => onFieldChange('keywords', e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Schlüsselwörter durch Komma getrennt"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">Gedichtinhalt</label>
        <Textarea
          value={poemData.content}
          onChange={(e) => onFieldChange('content', e.target.value)}
          className="min-h-[200px]"
          placeholder="Geben Sie hier den Inhalt des Gedichts ein..."
        />
      </div>
      
      <Button 
        onClick={onSubmit}
        className="w-full mt-6"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Gedicht erstellen
      </Button>
    </div>
  );
};

export default ManualForm;
