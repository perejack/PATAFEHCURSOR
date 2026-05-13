import { createClient } from "@supabase/supabase-js";

// TEMP (testing): hardcoded fallbacks — revert to env-only before production.
const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://ouqurcrejgdbtigqoxev.supabase.co";
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cXVyY3JlamdkYnRpZ3FveGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDMxMjQsImV4cCI6MjA5NDIxOTEyNH0.uqh20sFQB5bKuXfMrdLj10zwoYGqVPPjiOUviy8wUuo";

const normalizedUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");

export const supabase = createClient(normalizedUrl, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
