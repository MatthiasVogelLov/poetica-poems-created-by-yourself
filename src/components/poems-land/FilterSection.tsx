
import React from 'react';
import { useTranslations } from '@/hooks/use-translations';

interface FilterSectionProps {
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  setStyleFilter: (filter: string) => void;
  setAudienceFilter: (filter: string) => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  getUniqueStyles: () => string[];
  getUniqueAudiences: () => string[];
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  getStyleDisplay: (style: string) => string;
  getAudienceDisplay: (audience: string) => string;
  searchQuery: string;
  keywordFilters: string[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  occasionFilter,
  contentTypeFilter,
  styleFilter,
  audienceFilter,
  setOccasionFilter,
  setContentTypeFilter,
  setStyleFilter,
  setAudienceFilter,
  clearFilters,
  getUniqueOccasions,
  getUniqueContentTypes,
  getUniqueStyles,
  getUniqueAudiences,
  getOccasionDisplay,
  getContentTypeDisplay,
  getStyleDisplay,
  getAudienceDisplay,
  searchQuery,
  keywordFilters,
}) => {
  const { t, language } = useTranslations();
  
  const hasActiveFilters = occasionFilter !== 'all' || 
    contentTypeFilter !== 'all' || 
    styleFilter !== 'all' || 
    audienceFilter !== 'all' || 
    searchQuery !== '' ||
    keywordFilters.length > 0;
    
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium mb-4">{t('poemsland.filters')}</h3>
      
      <div className="space-y-3">
        <select
          value={occasionFilter}
          onChange={(e) => setOccasionFilter(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="all">{t('poemsland.occasion')}</option>
          {getUniqueOccasions().map(occasion => (
            <option key={occasion} value={occasion}>
              {getOccasionDisplay(occasion)}
            </option>
          ))}
        </select>
        
        <select
          value={contentTypeFilter}
          onChange={(e) => setContentTypeFilter(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="all">{t('poemsland.contentType')}</option>
          {getUniqueContentTypes().map(contentType => (
            <option key={contentType} value={contentType}>
              {getContentTypeDisplay(contentType)}
            </option>
          ))}
        </select>
        
        <select
          value={styleFilter}
          onChange={(e) => setStyleFilter(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="all">{t('poemsland.style')}</option>
          {getUniqueStyles().map(style => (
            <option key={style} value={style}>
              {getStyleDisplay(style)}
            </option>
          ))}
        </select>
        
        <select
          value={audienceFilter}
          onChange={(e) => setAudienceFilter(e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="all">{t('poemsland.audience')}</option>
          {getUniqueAudiences().map(audience => (
            <option key={audience} value={audience}>
              {getAudienceDisplay(audience)}
            </option>
          ))}
        </select>
        
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="w-full text-sm py-1.5 text-blue-600 hover:text-blue-800"
          >
            {language === 'en' ? 'Reset filters' : 'Filter zurücksetzen'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
