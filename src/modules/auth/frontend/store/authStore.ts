// Client-side session persistence. This is a frontend-only app with no
// backend to issue a real cookie/token session, so "signed in" just means
// "we have an email that matched a known identity at login time" (see
// src/lib/identity.ts) — there is no server-verified password or session
// expiry/rotation. That's an honest limitation of not having a backend
// yet, not a security feature; a real deployment would replace this with
// a server session behind the ERPNext integration prepared earlier. What
// this store *does* give the app for real: unlike every other Zustand
// store here (in-memory, reset on full reload), this one persists across
// reloads, and honors the login form's "Keep me signed in" checkbox —
// checked writes to localStorage (survives closing the browser), unchecked
// writes to sessionStorage (cleared when the tab closes) — instead of that
// checkbox being another toggle that doesn't do anything.
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

const REMEMBER_KEY = "agencyos-remember-me";

function engineFor(remember: boolean | null) {
  return remember === false ? sessionStorage : localStorage;
}

function currentRememberFlag(): boolean | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REMEMBER_KEY) !== "false";
}

const dynamicStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return engineFor(currentRememberFlag()).getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    engineFor(currentRememberFlag()).setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    engineFor(currentRememberFlag()).removeItem(name);
  },
};

type AuthState = {
  email: string | null;
  login: (email: string, remember?: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      login: (email, remember = true) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");
        }
        set({ email });
      },
      logout: () => set({ email: null }),
    }),
    { name: "agencyos-auth", storage: createJSONStorage(() => dynamicStorage) },
  ),
);
