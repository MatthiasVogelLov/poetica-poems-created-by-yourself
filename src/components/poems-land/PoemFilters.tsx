
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface PoemFiltersProps {
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  searchQuery: string;
  setOccasionFilter: (value: string) => void;
  setContentTypeFilter: (value: string) => void;
  setStyleFilter: (value: string) => void;
  setAudienceFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  clearFilters: () => void;
  occasions: string[];
  contentTypes: string[];
  styles: string[];
  audiences: string[];
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  getStyleDisplay: (style: string) => string;
  getAudienceDisplay: (audience: string) => string;
}

const PoemFilters: React.FC<PoemFiltersProps> = ({
  occasionFilter,
  contentTypeFilter,
  styleFilter = 'all',
  audienceFilter = 'all',
  searchQuery = '',
  setOccasionFilter,
  setContentTypeFilter,
  setStyleFilter,
  setAudienceFilter,
  setSearchQuery,
  clearFilters,
  occasions,
  contentTypes,
  styles = [],
  audiences = [],
  getOccasionDisplay,
  getContentTypeDisplay,
  getStyleDisplay,
  getAudienceDisplay
}) => {
  const filtersActive = (
    occasionFilter !== 'all' || 
    contentTypeFilter !== 'all' || 
    styleFilter !== 'all' || 
    (audienceFilter && audienceFilter !== 'all') || 
    searchQuery !== ''
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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
          
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Stile</SelectItem>
              {styles.map(style => (
                <SelectItem key={style} value={style}>
                  {getStyleDisplay(style)}
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
      
      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Gedichte durchsuchen..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 w-full"
        />
      </div>
    </div>
  );
};

export default PoemFilters;
