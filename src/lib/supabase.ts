
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// These will be replaced with actual values from environment variables in production
// For now, we're using placeholder values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper for handling errors from Supabase
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  return error.message || 'An unexpected error occurred';
};
