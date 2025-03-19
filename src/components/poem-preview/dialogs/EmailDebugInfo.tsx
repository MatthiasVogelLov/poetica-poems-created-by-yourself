
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';

interface EmailDebugInfoProps {
  debugInfo: string | null;
}

const EmailDebugInfo: React.FC<EmailDebugInfoProps> = ({ debugInfo }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!debugInfo) return null;

  return (
    <>
      {showDebug && (
        <div className="col-span-4 bg-amber-50 p-2 text-xs text-amber-900 rounded border border-amber-200 mt-2">
          <p className="font-semibold">Debug-Information:</p>
          <p className="break-all">{debugInfo}</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-muted-foreground text-xs"
          onClick={() => setShowDebug(!showDebug)}
        >
          <Bug className="h-3 w-3 mr-1" />
          {showDebug ? 'Debug ausblenden' : 'Debug anzeigen'}
        </Button>
      </div>
    </>
  );
};

export default EmailDebugInfo;
