import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL) as string;
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_KEY) as string;

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials missing! Check your .env file.");
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');
