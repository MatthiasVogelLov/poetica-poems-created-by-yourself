
import React from 'react';
import { Style, VerseType, Length } from '@/types/poem';
import BatchSelectField from '../../BatchSelectField';

interface StyleRhymeSectionProps {
  style: Style;
  verseType: VerseType;
  length: Length;
  onFieldChange: (field: string, value: any) => void;
}

const StyleRhymeSection: React.FC<StyleRhymeSectionProps> = ({
  style,
  verseType,
  length,
  onFieldChange
}) => {
  return (
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
        value={style}
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
        value={verseType}
        onChange={(value) => onFieldChange('verseType', value)}
      />
      
      <BatchSelectField
        label="Länge"
        options={[
          { value: 'kurz', label: 'Kurz' },
          { value: 'mittel', label: 'Mittel' },
          { value: 'lang', label: 'Lang' }
        ]}
        value={length}
        onChange={(value) => onFieldChange('length', value)}
      />
    </div>
  );
};

export default StyleRhymeSection;
