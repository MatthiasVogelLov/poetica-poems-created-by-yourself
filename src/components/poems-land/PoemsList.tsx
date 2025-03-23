
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PoemCard from './PoemCard';

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
}

const PoemsList: React.FC<PoemsListProps> = ({
  poems,
  isLoading,
  handleDeletePoem,
  setSelectedPoemId,
  getOccasionDisplay,
  getContentTypeDisplay,
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

  return (
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
  );
};

export default PoemsList;
