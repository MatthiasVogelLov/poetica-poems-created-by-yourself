import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { StatItem } from '@/types/stats';

interface StatsTableProps {
  title: string;
  data: StatItem[];
  hideTitle?: boolean;
}

const StatsTable = ({ title, data, hideTitle = false }: StatsTableProps) => {
  return (
    <div>
      {!hideTitle && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{title.split(' ').pop()}</TableHead>
            <TableHead className="text-right">Gesamt</TableHead>
            <TableHead className="text-right">Heute</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.todayValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatsTable;
