import { createClient } from "@supabase/supabase-js";

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL;
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawUrl || !anonKey) {
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

const normalizedUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");

export const supabase = createClient(normalizedUrl, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
