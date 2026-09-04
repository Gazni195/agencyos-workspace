// Browser-safe Supabase client. Uses the anon/public key, which is designed
// to be exposed client-side — real access control lives in Postgres Row
// Level Security policies (see supabase/migrations/), not in this key being
// secret. Every module's store should read/write through this client
// instead of its old in-memory seed array.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabaseTypes";

const url = import.meta.env["VITE_SUPABASE_URL"];
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set the connected Supabase project's browser variables in the project environment.",
  );
}

export const supabase = createClient<Database>(url, anonKey);
