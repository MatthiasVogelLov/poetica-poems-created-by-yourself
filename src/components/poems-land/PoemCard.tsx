
import React from 'react';
import { Heart, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  created_at: string;
}

interface PoemCardProps {
  poem: Poem;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

const PoemCard: React.FC<PoemCardProps> = ({
  poem,
  getOccasionDisplay,
  getContentTypeDisplay,
  onDelete,
  onClick
}) => {
  return (
    <Card 
      className="relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="pt-6 h-40 flex flex-col">
        <div className="absolute top-4 left-4">
          <Heart size={18} className="text-muted-foreground hover:text-primary transition-colors" />
        </div>
        <div className="absolute top-4 right-4">
          <X 
            size={18} 
            className="text-muted-foreground hover:text-destructive transition-colors" 
            onClick={(e) => onDelete(poem.id, e)}
          />
        </div>
        
        <h3 className="font-medium font-serif text-center mt-4 flex-1 line-clamp-2">
          {poem.title}
        </h3>
        
        <div className="flex justify-between items-center mt-4 text-xs">
          <div className="flex gap-2 flex-wrap">
            {poem.occasion && (
              <Badge variant="secondary" className="text-xs">
                {getOccasionDisplay(poem.occasion)}
              </Badge>
            )}
            {poem.content_type && (
              <Badge variant="outline" className="text-xs">
                {getContentTypeDisplay(poem.content_type)}
              </Badge>
            )}
          </div>
          <span className="text-muted-foreground">
            {new Date(poem.created_at).toLocaleDateString('de-DE', { 
              month: 'short', 
              day: '2-digit' 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoemCard;
