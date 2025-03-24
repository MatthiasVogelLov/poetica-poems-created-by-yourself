
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PoemCard from './PoemCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  created_at: string;
}

interface PoemsListProps {
  poems: Poem[];
  isLoading: boolean;
  handleDeletePoem: (id: string, e: React.MouseEvent) => void;
  setSelectedPoemId: (id: string) => void;
  getOccasionDisplay: (occasion: string) => string;
  getContentTypeDisplay: (contentType: string) => string;
  page?: number;
  totalCount?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  hasMore?: boolean;
  poemsPerPage?: number;
}

const PoemsList: React.FC<PoemsListProps> = ({
  poems,
  isLoading,
  handleDeletePoem,
  setSelectedPoemId,
  getOccasionDisplay,
  getContentTypeDisplay,
  page = 1,
  totalCount = 0,
  onNextPage,
  onPrevPage,
  hasMore = false,
  poemsPerPage = 12,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse">Gedichte werden geladen...</div>
      </div>
    );
  }

  if (poems.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-muted-foreground mb-2">Keine Gedichte gefunden</p>
        <p className="text-sm text-muted-foreground mb-4">
          Erstellen Sie Ihr erstes Gedicht, um es hier zu speichern.
        </p>
        <Button onClick={() => navigate('/generator')}>
          Gedicht erstellen
        </Button>
      </div>
    );
  }

  const startRange = ((page - 1) * poemsPerPage) + 1;
  const endRange = Math.min(page * poemsPerPage, totalCount);
  const showPagination = totalCount > poemsPerPage && onNextPage && onPrevPage;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {poems.map((poem) => (
          <PoemCard
            key={poem.id}
            poem={poem}
            getOccasionDisplay={getOccasionDisplay}
            getContentTypeDisplay={getContentTypeDisplay}
            onDelete={handleDeletePoem}
            onClick={() => setSelectedPoemId(poem.id)}
          />
        ))}
      </div>
      
      {showPagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Zeige {startRange} bis {endRange} von {totalCount} Gedichten
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNextPage}
              disabled={!hasMore}
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemsList;
