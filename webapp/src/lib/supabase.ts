import { createClient } from '@supabase/supabase-js';

// Пытаемся получить конфиг от сервера (бота)
const fetchConfig = async () => {
    try {
        const res = await fetch('/api/config');
        if (res.ok) return await res.json();
    } catch (e) {
        console.error('Failed to fetch config from server', e);
    }
    return null;
};

const config = await fetchConfig();

const supabaseUrl = config?.supabase_url || (import.meta.env.VITE_SUPABASE_URL as string);
const supabaseKey = config?.supabase_anon_key || (import.meta.env.VITE_SUPABASE_ANON_KEY as string);

export const supabase = createClient(supabaseUrl, supabaseKey);
export const botConfig = config;
