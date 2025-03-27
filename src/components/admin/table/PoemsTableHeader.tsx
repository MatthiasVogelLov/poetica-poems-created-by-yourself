
import React from 'react';
import { TableRow, TableHead } from '@/components/ui/table';

const PoemsTableHeader: React.FC = () => {
  return (
    <TableRow>
      <TableHead className="w-[250px]">Titel</TableHead>
      <TableHead>Anlass</TableHead>
      <TableHead>Thema</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Erstellt am</TableHead>
      <TableHead className="text-right">Aktionen</TableHead>
    </TableRow>
  );
};

export default PoemsTableHeader;
