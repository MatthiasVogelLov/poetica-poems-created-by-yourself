
import React from 'react';
import { Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface PopularKeywordsProps {
  keywords: string[];
  selectedKeywords: string[];
  onKeywordClick: (keyword: string) => void;
  onClearAllKeywords: () => void;
}

const PopularKeywords: React.FC<PopularKeywordsProps> = ({ 
  keywords, 
  selectedKeywords,
  onKeywordClick,
  onClearAllKeywords
}) => {
  if (!keywords.length) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-muted-foreground" />
          <h3 className="font-medium">Schlagwörter</h3>
        </div>
        
        {selectedKeywords.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAllKeywords}
            className="text-xs h-7 px-2"
          >
            Alle löschen
          </Button>
        )}
      </div>
      
      <Separator className="mb-3" />
      
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => {
          const isSelected = selectedKeywords.includes(keyword);
          return (
            <Badge 
              key={keyword}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer text-sm px-3 py-1 hover:bg-slate-100 flex items-center ${isSelected ? 'pr-2' : ''}`}
              onClick={() => onKeywordClick(keyword)}
            >
              {keyword}
              {isSelected && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default PopularKeywords;
