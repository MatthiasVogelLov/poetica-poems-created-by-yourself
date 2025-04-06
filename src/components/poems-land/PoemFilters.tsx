
import React from 'react';
import { Filter, Search, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';

interface PoemFiltersProps {
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  searchQuery: string;
  keywordFilters: string[];
  setOccasionFilter: (value: string) => void;
  setContentTypeFilter: (value: string) => void;
  setStyleFilter: (value: string) => void;
  setAudienceFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  toggleKeywordFilter?: (keyword: string) => void;
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
  keywordFilters = [],
  setOccasionFilter,
  setContentTypeFilter,
  setStyleFilter,
  setAudienceFilter,
  setSearchQuery,
  toggleKeywordFilter,
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
  const { t, language } = useTranslations();
  
  const filtersActive = (
    occasionFilter !== 'all' || 
    contentTypeFilter !== 'all' || 
    styleFilter !== 'all' || 
    (audienceFilter && audienceFilter !== 'all') || 
    searchQuery !== '' ||
    keywordFilters.length > 0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center">
          <Filter size={18} className="mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">{t('poemsland.filters')}:</span>
        </div>
        
        <div className="flex flex-wrap gap-4 flex-1">
          <Select value={occasionFilter} onValueChange={setOccasionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('poemsland.occasion')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('poemsland.occasion')}</SelectItem>
              {occasions.map(occasion => (
                <SelectItem key={occasion} value={occasion}>
                  {getOccasionDisplay(occasion)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('poemsland.contentType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('poemsland.contentType')}</SelectItem>
              {contentTypes.map(contentType => (
                <SelectItem key={contentType} value={contentType}>
                  {getContentTypeDisplay(contentType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('poemsland.style')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('poemsland.style')}</SelectItem>
              {styles.map(style => (
                <SelectItem key={style} value={style}>
                  {getStyleDisplay(style)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('poemsland.audience')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('poemsland.audience')}</SelectItem>
              {audiences.map(audience => (
                <SelectItem key={audience} value={audience}>
                  {getAudienceDisplay(audience)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              {language === 'en' ? 'Reset filters' : 'Filter zurücksetzen'}
            </Button>
          )}
        </div>
      </div>
      
      {keywordFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 ml-1">
          <div className="flex items-center">
            <Tag size={14} className="text-muted-foreground mr-2" />
            <span className="text-sm">{language === 'en' ? 'Keywords:' : 'Schlagwörter:'}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {keywordFilters.map(keyword => (
              <Badge 
                key={keyword}
                variant="default" 
                className="px-2 py-1 flex items-center"
              >
                {keyword}
                {toggleKeywordFilter && (
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleKeywordFilter(keyword);
                    }}
                  />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={language === 'en' ? "Search poems..." : "Gedichte durchsuchen..."}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 w-full"
        />
      </div>
    </div>
  );
};

export default PoemFilters;
