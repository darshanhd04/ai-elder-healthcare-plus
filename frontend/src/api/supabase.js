import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tfyzepwbamhhmvwakjww.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeXplcHdiYW1oaG12d2Frand3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzg3NzgsImV4cCI6MjA4MDk1NDc3OH0.wl9_qvclui3VMNfwdKs5Nir34YP22i3MLL8j0Ff97jA';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
