
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import StyleRhymeSection from './form-sections/StyleRhymeSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Style, VerseType, Length } from '@/types/poem';
import { toast } from 'sonner';

interface TitleKeywordPair {
  id: string;
  title: string;
  keywords: string;
}

interface MassUploadFormProps {
  isGenerating: boolean;
  onGenerate: (pairs: TitleKeywordPair[], style: Style, verseType: VerseType, length: Length, useRandomOptions: boolean) => void;
}

const MassUploadForm: React.FC<MassUploadFormProps> = ({ isGenerating, onGenerate }) => {
  const [style, setStyle] = useState<Style>('klassisch');
  const [verseType, setVerseType] = useState<VerseType>('kreuzreim');
  const [length, setLength] = useState<Length>('mittel');
  const [useRandomOptions, setUseRandomOptions] = useState(false);
  const [pairs, setPairs] = useState<TitleKeywordPair[]>([
    { id: '1', title: '', keywords: '' },
    { id: '2', title: '', keywords: '' },
    { id: '3', title: '', keywords: '' },
    { id: '4', title: '', keywords: '' },
    { id: '5', title: '', keywords: '' },
  ]);

  const handleFieldChange = (field: string, value: any) => {
    switch (field) {
      case 'style':
        setStyle(value);
        break;
      case 'verseType':
        setVerseType(value);
        break;
      case 'length':
        setLength(value);
        break;
      case 'useRandomOptions':
        setUseRandomOptions(value);
        break;
    }
  };

  const handlePairChange = (id: string, field: 'title' | 'keywords', value: string) => {
    setPairs(prev => prev.map(pair => 
      pair.id === id ? { ...pair, [field]: value } : pair
    ));
  };

  const addPair = () => {
    setPairs(prev => [...prev, { id: Date.now().toString(), title: '', keywords: '' }]);
  };

  const removePair = (id: string) => {
    if (pairs.length <= 1) {
      toast.error('Mindestens ein Titel-Schlüsselwort-Paar ist erforderlich');
      return;
    }
    setPairs(prev => prev.filter(pair => pair.id !== id));
  };

  const handleSubmit = () => {
    // Validate at least one pair has a title
    const validPairs = pairs.filter(pair => pair.title.trim() !== '');
    if (validPairs.length === 0) {
      toast.error('Bitte geben Sie mindestens einen Titel ein');
      return;
    }
    
    // Only send pairs that have titles
    onGenerate(validPairs, style, verseType, length, useRandomOptions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 py-4">
        <Switch
          id="mass-random-mode"
          checked={useRandomOptions}
          onCheckedChange={(value) => handleFieldChange('useRandomOptions', value)}
        />
        <Label htmlFor="mass-random-mode" className="font-medium">
          Optionen zufällig auswählen
        </Label>
      </div>

      {!useRandomOptions && (
        <StyleRhymeSection
          style={style}
          verseType={verseType}
          length={length}
          onFieldChange={handleFieldChange}
        />
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Titel und Schlüsselwörter</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addPair}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Paar hinzufügen
          </Button>
        </div>
        
        {pairs.map((pair) => (
          <Card key={pair.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${pair.id}`} className="text-sm font-medium">Titel</Label>
                <Input
                  id={`title-${pair.id}`}
                  value={pair.title}
                  onChange={(e) => handlePairChange(pair.id, 'title', e.target.value)}
                  placeholder="Gedichttitel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`keywords-${pair.id}`} className="text-sm font-medium">Schlüsselwörter</Label>
                <div className="flex gap-2">
                  <Input
                    id={`keywords-${pair.id}`}
                    value={pair.keywords}
                    onChange={(e) => handlePairChange(pair.id, 'keywords', e.target.value)}
                    placeholder="Komma-getrennte Schlüsselwörter"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removePair(pair.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isGenerating} 
        className="w-full mt-4"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {isGenerating ? 'Generiere Gedichte...' : `${pairs.length} Gedichte generieren`}
      </Button>
    </div>
  );
};

export default MassUploadForm;
