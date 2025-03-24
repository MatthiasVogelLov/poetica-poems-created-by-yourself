
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Eye, Upload, X } from 'lucide-react';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import DownloadButton from './DownloadButton';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface BatchPoemsListProps {
  poems: any[];
  isLoading: boolean;
  onStatusChange: (id: string, status: 'published' | 'deleted') => void;
  onRefresh: () => void;
}

const BatchPoemsList: React.FC<BatchPoemsListProps> = ({ 
  poems, 
  isLoading, 
  onStatusChange,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10 animate-pulse">
        Lade Gedichte...
      </div>
    );
  }

  if (poems.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="mb-3 text-muted-foreground">Keine Batch-Gedichte gefunden</p>
        <p className="text-sm text-muted-foreground mb-6">
          Erstellen Sie neue Gedichte über die Template-basierte oder manuelle Erstellung.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Veröffentlicht</Badge>;
      case 'deleted':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Gelöscht</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Entwurf</Badge>;
    }
  };

  // Group poems by status
  const draftPoems = poems.filter(poem => poem.status === 'draft');
  const publishedPoems = poems.filter(poem => poem.status === 'published');
  const deletedPoems = poems.filter(poem => poem.status === 'deleted');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Batch-Gedichte ({poems.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCw size={16} className="mr-2" />
            Aktualisieren
          </Button>
          
          <DownloadButton 
            currentData={poems.map(poem => ({
              id: poem.id,
              title: poem.title,
              status: poem.status,
              occasion: getOccasionDisplay(poem.occasion),
              content_type: getContentTypeDisplay(poem.content_type),
              created_at: poem.created_at
            }))} 
            dataTitle="Batch Poems" 
          />
        </div>
      </div>

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
              <TableRow key={poem.id}>
                <TableCell className="font-medium">{poem.title}</TableCell>
                <TableCell>{getOccasionDisplay(poem.occasion)}</TableCell>
                <TableCell>{getContentTypeDisplay(poem.content_type)}</TableCell>
                <TableCell>{getStatusBadge(poem.status)}</TableCell>
                <TableCell>
                  {poem.created_at && format(new Date(poem.created_at), 'dd.MM.yyyy', { locale: de })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Gedicht ansehen"
                      onClick={() => window.open(`/poemsland?preview=${poem.id}`, '_blank')}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="In PoemsLand veröffentlichen"
                      onClick={() => onStatusChange(poem.id, 'published')}
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    >
                      <Upload size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Gedicht löschen"
                      onClick={() => onStatusChange(poem.id, 'deleted')}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Published Poems */}
            {publishedPoems.map((poem) => (
              <TableRow key={poem.id} className="bg-green-50/20">
                <TableCell className="font-medium">{poem.title}</TableCell>
                <TableCell>{getOccasionDisplay(poem.occasion)}</TableCell>
                <TableCell>{getContentTypeDisplay(poem.content_type)}</TableCell>
                <TableCell>{getStatusBadge(poem.status)}</TableCell>
                <TableCell>
                  {poem.created_at && format(new Date(poem.created_at), 'dd.MM.yyyy', { locale: de })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Gedicht ansehen"
                      onClick={() => window.open(`/poemsland/${poem.id}`, '_blank')}
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Deleted Poems */}
            {deletedPoems.map((poem) => (
              <TableRow key={poem.id} className="bg-red-50/10">
                <TableCell className="font-medium">{poem.title}</TableCell>
                <TableCell>{getOccasionDisplay(poem.occasion)}</TableCell>
                <TableCell>{getContentTypeDisplay(poem.content_type)}</TableCell>
                <TableCell>{getStatusBadge(poem.status)}</TableCell>
                <TableCell>
                  {poem.created_at && format(new Date(poem.created_at), 'dd.MM.yyyy', { locale: de })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Gedicht ansehen"
                      onClick={() => window.open(`/poemsland?preview=${poem.id}`, '_blank')}
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BatchPoemsList;
