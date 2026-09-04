// Server-only Supabase client using the service_role key, which bypasses
// Row Level Security entirely. Never import this from a route component or
// anything that ends up in client-side JS — only from TanStack Start server
// functions (files/functions that run exclusively on the server). Used for
// privileged operations RLS can't express cleanly, e.g. creating a new
// employee's auth account during onboarding.
//
// The client is created lazily inside getSupabaseAdmin() rather than at
// module scope: env vars are injected at request time in the server
// runtime, and a module-scope throw would take down SSR for every page.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabaseTypes";

const FALLBACK_SUPABASE_URL = "https://igzujihzbdoajrmbwzgl.supabase.co";

let cached: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (cached) return cached;

  const url = process.env["SUPABASE_URL"] || FALLBACK_SUPABASE_URL;
  // The hosting platform reserves the SUPABASE_* secret namespace, so the
  // service role key may be stored under the AGENCYOS_ prefix instead.
  const serviceRoleKey =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["AGENCYOS_SUPABASE_SERVICE_ROLE_KEY"];

  if (!serviceRoleKey) {
    throw new Error(
      "Missing service role key. Set SUPABASE_SERVICE_ROLE_KEY (or AGENCYOS_SUPABASE_SERVICE_ROLE_KEY) in the server environment — never with a VITE_ prefix.",
    );
  }

  cached = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
