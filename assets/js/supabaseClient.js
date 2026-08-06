import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { CONFIG } from './config.js';

const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseKey = CONFIG.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  async accessToken() {
    if (typeof window === "undefined" || !window.Clerk) return null;
    await window.Clerk.load();
    return (await window.Clerk.session?.getToken()) ?? null;
  },
});

export default supabase;