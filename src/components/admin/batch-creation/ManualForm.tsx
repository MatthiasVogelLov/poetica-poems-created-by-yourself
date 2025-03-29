import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Wand2, Upload, CircleCheck } from 'lucide-react';
import { Audience, Occasion, ContentType, Style, VerseType, Length } from '@/types/poem';
import BatchSelectField from '../BatchSelectField';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
  generateContent?: boolean;
  publishAfterCreation?: boolean;
}

interface ManualFormProps {
  poemData: ManualPoemData;
  onFieldChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onGenerateContent?: () => void;
  isGenerating?: boolean;
}

const ManualForm: React.FC<ManualFormProps> = ({
  poemData,
  onFieldChange,
  onSubmit,
  onGenerateContent,
  isGenerating = false
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
            { value: 'kurz', label: 'Kurz' },
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
        <p className="text-xs text-gray-500">
          Hinweis: Nomen werden automatisch großgeschrieben und am Ende des Gedichts aufgelistet.
        </p>
      </div>
      
      <div className="space-y-2 py-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="generate-content"
            checked={poemData.generateContent}
            onCheckedChange={(value) => onFieldChange('generateContent', value)}
          />
          <Label htmlFor="generate-content" className="font-medium">
            Inhalt automatisch generieren
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="publish-after-creation"
            checked={poemData.publishAfterCreation}
            onCheckedChange={(value) => onFieldChange('publishAfterCreation', value)}
          />
          <Label htmlFor="publish-after-creation" className="font-medium">
            Nach Erstellung direkt veröffentlichen
          </Label>
          {poemData.publishAfterCreation && (
            <Badge variant="success" className="ml-2">
              <CircleCheck className="h-3 w-3 mr-1" />
              Wird direkt in PoemsLand erscheinen
            </Badge>
          )}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Gedichtinhalt</label>
          
          {onGenerateContent && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateContent}
              disabled={isGenerating}
            >
              <Wand2 className="mr-1 h-4 w-4" />
              {isGenerating ? 'Generiere...' : 'Jetzt generieren'}
            </Button>
          )}
        </div>
        
        <Textarea
          value={poemData.content}
          onChange={(e) => onFieldChange('content', e.target.value)}
          className="min-h-[200px]"
          placeholder={poemData.generateContent 
            ? "Inhalt wird beim Speichern automatisch generiert..." 
            : "Geben Sie hier den Inhalt des Gedichts ein..."}
          disabled={isGenerating}
        />
      </div>
      
      <Button 
        onClick={onSubmit}
        className={`w-full mt-6 ${poemData.publishAfterCreation ? 'bg-green-600 hover:bg-green-700' : ''}`}
        disabled={isGenerating}
      >
        {poemData.publishAfterCreation ? (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generiere Gedicht...' : 'Gedicht erstellen & veröffentlichen'}
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generiere Gedicht...' : 'Gedicht erstellen'}
          </>
        )}
      </Button>
    </div>
  );
};

export default ManualForm;
