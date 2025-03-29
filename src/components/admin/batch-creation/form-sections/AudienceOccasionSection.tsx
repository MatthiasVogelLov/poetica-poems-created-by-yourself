
import React from 'react';
import { Audience, Occasion, ContentType } from '@/types/poem';
import BatchSelectField from '../../BatchSelectField';

interface AudienceOccasionSectionProps {
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  onFieldChange: (field: string, value: any) => void;
}

const AudienceOccasionSection: React.FC<AudienceOccasionSectionProps> = ({
  audience,
  occasion,
  contentType,
  onFieldChange
}) => {
  return (
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
        value={audience}
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
        value={occasion}
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
        value={contentType}
        onChange={(value) => onFieldChange('contentType', value)}
      />
    </div>
  );
};

export default AudienceOccasionSection;
