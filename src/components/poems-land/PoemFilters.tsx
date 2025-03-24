
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface PoemFiltersProps {
  occasionFilter: string;
  contentTypeFilter: string;
  audienceFilter: string;
  setOccasionFilter: (value: string) => void;
  setContentTypeFilter: (value: string) => void;
  setAudienceFilter: (value: string) => void;
  clearFilters: () => void;
  occasions: string[];
  contentTypes: string[];
  audiences: string[];
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  getAudienceDisplay: (audience: string) => string;
}

const PoemFilters: React.FC<PoemFiltersProps> = ({
  occasionFilter,
  contentTypeFilter,
  audienceFilter = 'all',
  setOccasionFilter,
  setContentTypeFilter,
  setAudienceFilter,
  clearFilters,
  occasions,
  contentTypes,
  audiences = [],
  getOccasionDisplay,
  getContentTypeDisplay,
  getAudienceDisplay
}) => {
  const filtersActive = (occasionFilter !== 'all' || contentTypeFilter !== 'all' || (audienceFilter && audienceFilter !== 'all'));

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex items-center">
        <Filter size={18} className="mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
      </div>
      
      <div className="flex flex-wrap gap-4 flex-1">
        <Select value={occasionFilter} onValueChange={setOccasionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Anlass" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Anlässe</SelectItem>
            {occasions.map(occasion => (
              <SelectItem key={occasion} value={occasion}>
                {getOccasionDisplay(occasion)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Thema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Themen</SelectItem>
            {contentTypes.map(contentType => (
              <SelectItem key={contentType} value={contentType}>
                {getContentTypeDisplay(contentType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={audienceFilter} onValueChange={setAudienceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Zielgruppe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Zielgruppen</SelectItem>
            {audiences.map(audience => (
              <SelectItem key={audience} value={audience}>
                {getAudienceDisplay(audience)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {filtersActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Filter zurücksetzen
          </Button>
        )}
      </div>
    </div>
  );
};

export default PoemFilters;
