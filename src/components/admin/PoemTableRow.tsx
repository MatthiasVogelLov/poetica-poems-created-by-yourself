
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Upload, X } from 'lucide-react';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface PoemTableRowProps {
  poem: any;
  onStatusChange?: (id: string, status: 'published' | 'deleted') => void;
}

const PoemTableRow: React.FC<PoemTableRowProps> = ({ poem, onStatusChange }) => {
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

  const getRowClassName = () => {
    switch (poem.status) {
      case 'published':
        return "bg-green-50/20";
      case 'deleted':
        return "bg-red-50/10";
      default:
        return "";
    }
  };

  const getPoemViewUrl = () => {
    return poem.status === 'published' 
      ? `/poemsland/${poem.id}` 
      : `/poemsland?preview=${poem.id}`;
  };

  return (
    <TableRow key={poem.id} className={getRowClassName()}>
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
            onClick={() => window.open(getPoemViewUrl(), '_blank')}
          >
            <Eye size={16} />
          </Button>
          
          {poem.status === 'draft' && onStatusChange && (
            <>
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
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PoemTableRow;
