// Server-only Supabase client using the service_role key, which bypasses
// Row Level Security entirely. Never import this from a route component or
// anything that ends up in client-side JS — only from TanStack Start server
// functions (files/functions that run exclusively on the server). Used for
// privileged operations RLS can't express cleanly, e.g. creating a new
// employee's auth account during onboarding.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabaseTypes";

// Deliberately not named SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY —
// Lovable reserves that exact prefix for its own native "Lovable Cloud"
// Supabase integration and refuses to store project env vars under it,
// which silently breaks a manually-connected project like this one.
const url = process.env["AGENCYOS_SUPABASE_URL"];
const serviceRoleKey = process.env["AGENCYOS_SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing AGENCYOS_SUPABASE_URL / AGENCYOS_SUPABASE_SERVICE_ROLE_KEY server env vars. Set them in .env (never prefix with VITE_ — that would bundle the secret key into client JS).",
  );
}

export const supabaseAdmin = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
