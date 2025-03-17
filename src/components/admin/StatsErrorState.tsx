
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangleIcon } from 'lucide-react';

interface StatsErrorStateProps {
  error: string;
}

const StatsErrorState = ({ error }: StatsErrorStateProps) => {
  return (
    <div className="w-full p-8">
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Fehler</AlertTitle>
        <AlertDescription>
          Die Statistiken konnten nicht geladen werden: {error}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StatsErrorState;
