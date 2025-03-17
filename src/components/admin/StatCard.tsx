
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-4xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
