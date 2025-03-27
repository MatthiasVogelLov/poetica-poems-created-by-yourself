
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmptyTableMessage: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
        Keine Gedichte gefunden
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableMessage;
