// Client-side auth backed by real Supabase accounts (see
// supabase/migrations/0001_roles_and_profiles.sql for the schema). Session
// persistence, password verification, and token refresh are all handled
// by Supabase's own client under the hood — this store just mirrors its
// current auth state so the rest of the app can read "am I signed in"
// synchronously without awaiting a promise on every render.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useSessionStore } from "./sessionStore";

type AuthState = {
  userId: string | null;
  email: string | null;
  // True until the first check of Supabase's session (from localStorage)
  // has resolved. Distinct from "not signed in" — used by __root.tsx so it
  // doesn't redirect to /login before it actually knows the answer.
  initializing: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>(() => ({
  userId: null,
  email: null,
  initializing: true,
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message, needsEmailConfirmation: false };
    // Supabase returns a user with no session when email confirmation is
    // required (the default) — session is null until they click the
    // confirmation link, at which point they still need to sign in.
    return { error: null, needsEmailConfirmation: !data.session };
  },
  logout: async () => {
    await supabase.auth.signOut();
  },
}));

// Keep this store (and sessionStore's profile/permissions) in sync with
// Supabase's own session — fires once on load with whatever session exists
// in localStorage (or null), then again on every sign-in/sign-out.
supabase.auth.onAuthStateChange((_event, session) => {
  const user = session?.user ?? null;
  useAuthStore.setState({
    userId: user?.id ?? null,
    email: user?.email ?? null,
    initializing: false,
  });
  if (user) {
    void useSessionStore.getState().loadProfile(user.id);
  } else {
    useSessionStore.getState().clear();
  }
});
