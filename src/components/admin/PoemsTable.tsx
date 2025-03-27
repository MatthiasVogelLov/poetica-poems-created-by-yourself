
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import PoemTableRow from './PoemTableRow';
import PoemPreviewDialog from './PoemPreviewDialog';

interface PoemsTableProps {
  poems: any[];
  onStatusChange: (id: string, status: 'published' | 'deleted' | 'hidden_from_admin') => void;
  publishingState?: Record<string, boolean>;
  hidingState?: Record<string, boolean>;
}

const PoemsTable: React.FC<PoemsTableProps> = ({ 
  poems, 
  onStatusChange,
  publishingState = {},
  hidingState = {}
}) => {
  const [previewPoemId, setPreviewPoemId] = useState<string | null>(null);
  
  // Only show visible poems (filter out deleted and hidden)
  const visiblePoems = poems.filter(poem => 
    poem.status !== 'deleted' && poem.status !== 'hidden_from_admin'
  );
  
  // Group remaining poems by status (draft first, then published)
  const draftPoems = visiblePoems.filter(poem => poem.status === 'draft');
  const publishedPoems = visiblePoems.filter(poem => poem.status === 'published');

  const handlePreviewClick = (id: string) => {
    setPreviewPoemId(id);
  };

  const handleClosePreview = () => {
    setPreviewPoemId(null);
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Titel</TableHead>
              <TableHead>Anlass</TableHead>
              <TableHead>Thema</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draftPoems.map((poem) => (
              <PoemTableRow 
                key={poem.id}
                poem={poem}
                onStatusChange={onStatusChange}
                onPreviewClick={handlePreviewClick}
                isPublishing={!!publishingState[poem.id]}
                isHiding={!!hidingState[poem.id]}
              />
            ))}

            {publishedPoems.map((poem) => (
              <PoemTableRow 
                key={poem.id}
                poem={poem}
                onStatusChange={onStatusChange}
                onPreviewClick={handlePreviewClick}
                isPublishing={!!publishingState[poem.id]}
                isHiding={!!hidingState[poem.id]}
              />
            ))}
            
            {visiblePoems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Keine Gedichte gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <PoemPreviewDialog 
        poemId={previewPoemId}
        onClose={handleClosePreview}
        onPublish={(id) => onStatusChange(id, 'published')}
      />
    </>
  );
};

export default PoemsTable;
