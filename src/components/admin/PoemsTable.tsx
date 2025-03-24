
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import PoemTableRow from './PoemTableRow';

interface PoemsTableProps {
  poems: any[];
  onStatusChange: (id: string, status: 'published' | 'deleted') => void;
}

const PoemsTable: React.FC<PoemsTableProps> = ({ poems, onStatusChange }) => {
  // Group poems by status
  const draftPoems = poems.filter(poem => poem.status === 'draft');
  const publishedPoems = poems.filter(poem => poem.status === 'published');
  const deletedPoems = poems.filter(poem => poem.status === 'deleted');

  return (
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
            />
          ))}

          {publishedPoems.map((poem) => (
            <PoemTableRow 
              key={poem.id}
              poem={poem}
            />
          ))}

          {deletedPoems.map((poem) => (
            <PoemTableRow 
              key={poem.id}
              poem={poem}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PoemsTable;
