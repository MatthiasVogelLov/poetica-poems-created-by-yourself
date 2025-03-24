
import React from 'react';

const EmptyPoemsList: React.FC = () => {
  return (
    <div className="text-center py-10 border rounded-lg">
      <p className="mb-3 text-muted-foreground">Keine Batch-Gedichte gefunden</p>
      <p className="text-sm text-muted-foreground mb-6">
        Erstellen Sie neue Gedichte über die Template-basierte oder manuelle Erstellung.
      </p>
    </div>
  );
};

export default EmptyPoemsList;
