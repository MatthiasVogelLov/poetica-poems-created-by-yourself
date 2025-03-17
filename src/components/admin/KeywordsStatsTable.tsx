
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface KeywordsStatsTableProps {
  keywordsUsed: number;
  keywordsTodayUsed: number;
}

const KeywordsStatsTable = ({ keywordsUsed, keywordsTodayUsed }: KeywordsStatsTableProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Gedichte mit individuellen Schlüsselwörtern</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metrik</TableHead>
            <TableHead className="text-right">Gesamt</TableHead>
            <TableHead className="text-right">Heute</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Mit Schlüsselwörtern</TableCell>
            <TableCell className="text-right">{keywordsUsed.toLocaleString()}</TableCell>
            <TableCell className="text-right">{keywordsTodayUsed}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default KeywordsStatsTable;
