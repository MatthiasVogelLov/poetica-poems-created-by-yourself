// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ihodewyltwbbbimbjzee.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2Rld3lsdHdiYmJpbWJqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDc3MDYsImV4cCI6MjA1NzY4MzcwNn0.wkxL_GPx5YJ7Y34Va5xmEIN3HDk3aeqVCkQ1DamIY5M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);