// Browser-safe Supabase client. Uses the anon/publishable key, which is
// designed to be exposed client-side — real access control lives in Postgres
// Row Level Security policies (see supabase/migrations/), not in this key
// being secret. Every module's store should read/write through this client
// instead of its old in-memory seed array.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabaseTypes";

// The connected AgencyOS Supabase project (igzujihzbdoajrmbwzgl). These are
// the *publishable* browser values and are safe to ship in client JS. They
// are baked in as a fallback so the app never white-screens when the
// preview/host environment doesn't inject VITE_SUPABASE_* variables — an
// explicit VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY still takes precedence.
const FALLBACK_SUPABASE_URL = "https://igzujihzbdoajrmbwzgl.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "sb_publishable_-djXmm-R7OLEOsNOFa98mg_Dusw-6KV";

const url: string =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || FALLBACK_SUPABASE_URL;
const anonKey: string =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) || FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(url, anonKey);
