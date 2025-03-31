
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Get environment variables
const supabaseUrl = 'https://ghurjtyemwqbwscjyppv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodXJqdHllbXdxYndzY2p5cHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTA2MDUsImV4cCI6MjA1ODk4NjYwNX0.yu5uaxEPmdco5I0g49DAy_sEFATDyXUSm8bj6fjU7tA';

// Create Supabase client with proper configuration for authentication
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper for handling errors from Supabase
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  return error.message || 'An unexpected error occurred';
};
