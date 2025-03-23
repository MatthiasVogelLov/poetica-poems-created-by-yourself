
import { supabase } from "@/integrations/supabase/client";

// Track feature usage in Supabase
export const trackShareUsage = async (platform: string, type: 'text' | 'image') => {
  try {
    await supabase.functions.invoke('track-stats', {
      body: {
        action: 'feature_used',
        data: {
          featureName: `share_${type === 'image' ? 'image_' : ''}${platform}`
        }
      }
    });
  } catch (error) {
    console.error(`Error tracking ${type} share feature usage:`, error);
  }
};
