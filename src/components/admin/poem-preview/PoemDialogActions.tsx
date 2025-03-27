
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PoemDialogActionsProps {
  poem: any;
  generating: boolean;
  publishing: boolean;
  onRegeneratePoem: () => void;
  onPublish: () => void;
}

const PoemDialogActions: React.FC<PoemDialogActionsProps> = ({
  poem,
  generating,
  publishing,
  onRegeneratePoem,
  onPublish
}) => {
  return (
    <div className="flex justify-between mt-4 pt-4 border-t">
      <Button
        variant="outline"
        onClick={onRegeneratePoem}
        disabled={generating}
      >
        {generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird generiert...
          </>
        ) : (
          'Neu generieren'
        )}
      </Button>
      
      {poem?.status === 'draft' && (
        <Button
          onClick={onPublish}
          disabled={publishing}
          className="bg-green-600 hover:bg-green-700"
        >
          {publishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird veröffentlicht...
            </>
          ) : (
            'In PoemsLand veröffentlichen'
          )}
        </Button>
      )}
    </div>
  );
};

export default PoemDialogActions;
