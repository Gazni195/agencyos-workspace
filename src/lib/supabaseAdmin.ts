// Server-only Supabase client using the service_role key, which bypasses
// Row Level Security entirely. Never import this from a route component or
// anything that ends up in client-side JS — only from TanStack Start server
// functions (files/functions that run exclusively on the server). Used for
// privileged operations RLS can't express cleanly, e.g. creating a new
// employee's auth account during onboarding.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabaseTypes";

const url = process.env["SUPABASE_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY server env vars. Set them in the server environment (never prefix the service role key with VITE_).",
  );
}

export const supabaseAdmin = createClient<Database>(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
