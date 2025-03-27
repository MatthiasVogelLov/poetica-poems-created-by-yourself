
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  startRange: number;
  endRange: number;
  visibleCount: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  hasMore: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  startRange,
  endRange,
  visibleCount,
  onPrevPage,
  onNextPage,
  hasMore
}) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        Zeige {startRange} bis {endRange} von {visibleCount} sichtbaren Gedichten
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
  );
};

export default PaginationControls;
