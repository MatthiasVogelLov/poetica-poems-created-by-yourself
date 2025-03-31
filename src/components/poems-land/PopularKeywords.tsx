
import React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PopularKeywordsProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
  activeKeyword: string | null;
}

const PopularKeywords: React.FC<PopularKeywordsProps> = ({ 
  keywords, 
  onKeywordClick, 
  activeKeyword 
}) => {
  if (!keywords.length) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={16} className="text-muted-foreground" />
        <h3 className="font-medium">Häufige Schlagwörter</h3>
      </div>
      
      <Separator className="mb-3" />
      
      <div className="flex flex-col gap-2">
        {keywords.map((keyword) => (
          <Badge 
            key={keyword}
            variant={activeKeyword === keyword ? "default" : "outline"}
            className="cursor-pointer justify-start text-sm px-3 py-1 hover:bg-slate-100"
            onClick={() => onKeywordClick(keyword)}
          >
            {keyword}
            {activeKeyword === keyword && (
              <span className="ml-auto text-xs">×</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PopularKeywords;
