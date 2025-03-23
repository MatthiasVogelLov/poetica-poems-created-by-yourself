
import { useTextSharing } from './use-text-sharing';
import { useImageSharing } from './use-image-sharing';

interface UsePoemSharingProps {
  poem: string;
  title: string;
  onCompleted?: () => void;
}

export function usePoemSharing({ poem, title, onCompleted }: UsePoemSharingProps) {
  const { handleTextShare } = useTextSharing({ poem, title, onCompleted });
  const { isCapturingImage, handleImageShare } = useImageSharing({ poem, title, onCompleted });

  return {
    isCapturingImage,
    handleTextShare,
    handleImageShare
  };
}

export { useTextSharing } from './use-text-sharing';
export { useImageSharing } from './use-image-sharing';
