// Frontend-only auth for the AgencyOS foundation. The demo account keeps the
// shell usable until a real auth provider is introduced in a later phase.
import { create } from "zustand";
import { useSessionStore } from "./sessionStore";
import { currentUser } from "@/mock";

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
  userId: "mock-user",
  email: currentUser.email,
  initializing: false,
  login: async (email, password) => {
    if (!email || !password) return { error: "Enter your email and password." };
    useAuthStore.setState({ userId: "mock-user", email, initializing: false });
    useSessionStore.getState().loadProfile("mock-user", email);
    return { error: null };
  },
  signUp: async (email, password, fullName) => {
    if (!email || !password || !fullName) {
      return { error: "Complete all fields to create your account.", needsEmailConfirmation: false };
    }
    useAuthStore.setState({ userId: "mock-user", email, initializing: false });
    useSessionStore.getState().loadProfile("mock-user", email, fullName);
    return { error: null, needsEmailConfirmation: false };
  },
  logout: async () => {
    useAuthStore.setState({ userId: null, email: null, initializing: false });
    useSessionStore.getState().clear();
  },
}));
