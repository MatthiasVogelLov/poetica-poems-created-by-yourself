
import React from 'react';
import { Heart, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { getFirstThreeLines } from '@/utils/poem-filter-utils';
interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  style?: string;
  created_at: string;
  audience?: string;
}
interface PoemCardProps {
  poem: Poem;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  getStyleDisplay?: (style: string) => string;
  getAudienceDisplay?: (audience: string) => string;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
}
const PoemCard: React.FC<PoemCardProps> = ({
  poem,
  getOccasionDisplay,
  getContentTypeDisplay,
  getStyleDisplay,
  getAudienceDisplay,
  onDelete,
  onClick
}) => {
  const {
    isAuthenticated
  } = useAdminAuth();
  const poemPreview = getFirstThreeLines(poem.content);
  return <Card className="relative cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="absolute top-4 left-4">
          <Heart size={18} className="text-muted-foreground hover:text-primary transition-colors" />
        </div>
        
        {isAuthenticated && <div className="absolute top-4 right-4">
            <X size={18} className="text-muted-foreground hover:text-destructive transition-colors" onClick={e => onDelete(poem.id, e)} />
          </div>}
        
        <h3 className="font-medium font-serif text-center mt-4 line-clamp-2">
          {poem.title}
        </h3>
        
        <div className="mt-3 text-sm text-center italic text-gray-600 line-clamp-3 flex-1">
          {poemPreview}
        </div>
        
        <div className="flex justify-between items-center mt-4 text-xs">
          <div className="flex gap-2 flex-wrap">
            {poem.occasion && <Badge variant="secondary" className="text-xs bg-lime-50">
                {getOccasionDisplay(poem.occasion)}
              </Badge>}
            {poem.content_type && <Badge variant="outline" className="text-xs">
                {getContentTypeDisplay(poem.content_type)}
              </Badge>}
            {poem.style && getStyleDisplay && <Badge variant="info" className="text-xs">
                {getStyleDisplay(poem.style)}
              </Badge>}
            {poem.audience && getAudienceDisplay && <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                {getAudienceDisplay(poem.audience)}
              </Badge>}
          </div>
          <span className="text-muted-foreground">
            {new Date(poem.created_at).toLocaleDateString('de-DE', {
            month: 'short',
            day: '2-digit'
          })}
          </span>
        </div>
      </CardContent>
    </Card>;
};
export default PoemCard;
