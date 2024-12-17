import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  toast.error('Database configuration error');
  // Instead of throwing, we'll create a client with empty credentials
  // This allows the app to load, but database operations will fail gracefully
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  // Store auth state
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  // Clear auth state
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  
  if (error) {
    throw error;
  }
};