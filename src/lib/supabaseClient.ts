// Browser-safe Supabase client. Uses the anon/public key, which is designed
// to be exposed client-side — real access control lives in Postgres Row
// Level Security policies (see supabase/migrations/), not in this key being
// secret. Every module's store should read/write through this client
// instead of its old in-memory seed array.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabaseTypes";

// Deliberately not named VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY —
// Lovable reserves that exact prefix for its own native "Lovable Cloud"
// Supabase integration and refuses to store project env vars under it,
// which silently breaks a manually-connected project like this one.
const url = import.meta.env["VITE_AGENCYOS_SUPABASE_URL"];
const anonKey = import.meta.env["VITE_AGENCYOS_SUPABASE_ANON_KEY"];

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_AGENCYOS_SUPABASE_URL / VITE_AGENCYOS_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project's values (Settings -> API).",
  );
}

export const supabase = createClient<Database>(url, anonKey);
