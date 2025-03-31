
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Get environment variables or use fallback values if they're missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase environment variables are not set:',
    !supabaseUrl ? 'Missing VITE_SUPABASE_URL' : '',
    !supabaseAnonKey ? 'Missing VITE_SUPABASE_ANON_KEY' : ''
  );
  
  // For development only - provide temporary placeholders to prevent crashes
  // Remove these placeholders in production
  if (import.meta.env.DEV) {
    console.warn(
      '⚠️ Using development placeholders. Please set up your Supabase project and update environment variables.'
    );
  }
}

// Create a temporary Supabase client with placeholders for development
// This allows the app to at least load, though functionality will be limited
const developmentUrl = 'https://placeholder-project.supabase.co';
const developmentKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyLXByb2plY3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY1MTY4MzIwMCwiZXhwIjoxOTY3MjU5NjAwfQ.placeholder';

// Use actual values if available, otherwise fall back to development placeholders
export const supabase = createClient<Database>(
  supabaseUrl || developmentUrl,
  supabaseAnonKey || developmentKey
);

// Helper for handling errors from Supabase
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  return error.message || 'An unexpected error occurred';
};
