
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import TextShareOptions from './TextShareOptions';
import ImageShareOptions from './ImageShareOptions';

interface ShareDialogProps {
  poem: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  poem,
  title,
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gedicht teilen</DialogTitle>
          <DialogDescription>
            Wählen Sie eine Plattform und Art, um Ihr Gedicht zu teilen.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Als Text</TabsTrigger>
            <TabsTrigger value="image">Als Bild</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
            <TextShareOptions poem={poem} title={title} onOpenChange={onOpenChange} />
          </TabsContent>
          
          <TabsContent value="image" className="mt-4">
            <ImageShareOptions poem={poem} title={title} onOpenChange={onOpenChange} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
