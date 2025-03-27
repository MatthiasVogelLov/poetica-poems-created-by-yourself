
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Upload, X, Loader2, EyeOff } from 'lucide-react';
import { getOccasionDisplay, getContentTypeDisplay } from '@/utils/poem-display-helpers';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PoemTableRowProps {
  poem: any;
  onStatusChange?: (id: string, status: 'published' | 'deleted' | 'hidden') => void;
  onPreviewClick?: (id: string) => void;
  isPublishing?: boolean;
  isHiding?: boolean;
}

const PoemTableRow: React.FC<PoemTableRowProps> = ({ 
  poem, 
  onStatusChange, 
  onPreviewClick,
  isPublishing = false,
  isHiding = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Veröffentlicht</Badge>;
      case 'deleted':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Gelöscht</Badge>;
      case 'hidden':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Ausgeblendet</Badge>;
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
      case 'hidden':
        return "bg-purple-50/10";
      default:
        return "";
    }
  };

  const getPoemViewUrl = () => {
    return poem.status === 'published' || poem.status === 'hidden'
      ? `/poemsland/${poem.id}` 
      : `/poemsland?preview=${poem.id}`;
  };

  // Determine if we should show publish button
  const showPublishButton = poem.status === 'draft' && onStatusChange;

  // Always show hide button for published poems
  const showHideButton = onStatusChange && poem.status === 'published';
  
  // Show delete button for drafts
  const showDeleteButton = onStatusChange && poem.status === 'draft';

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onPreviewClick && onPreviewClick(poem.id)}
                  disabled={isPublishing || isHiding}
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gedicht ansehen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {showPublishButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onStatusChange(poem.id, 'published')}
                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    disabled={isPublishing || isHiding}
                  >
                    {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>In PoemsLand veröffentlichen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {showHideButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onStatusChange(poem.id, 'hidden')}
                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                    disabled={isPublishing || isHiding}
                  >
                    {isHiding ? <Loader2 size={16} className="animate-spin" /> : <EyeOff size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aus Admin-Ansicht ausblenden (bleibt in PoemsLand)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {showDeleteButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onStatusChange(poem.id, 'deleted')}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    disabled={isPublishing || isHiding}
                  >
                    <X size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Gedicht löschen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PoemTableRow;
