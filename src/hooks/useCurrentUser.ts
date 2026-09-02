// Who's actually signed in right now — read from sessionStore's profile,
// loaded from Supabase's profiles table after real login (see authStore /
// sessionStore). Use this anywhere the UI needs to display "you" (header,
// greetings, "submitted by" on records created in-session).
import { useSessionStore } from "@/store/sessionStore";
import { initialsOf } from "@/data/crm";

export type ResolvedIdentity = {
  name: string;
  initials: string;
  email: string;
  roleId: string;
};

const EMPTY_IDENTITY: ResolvedIdentity = { name: "", initials: "", email: "", roleId: "" };

function fromProfile(
  profile: ReturnType<typeof useSessionStore.getState>["profile"],
): ResolvedIdentity {
  if (!profile) return EMPTY_IDENTITY;
  return {
    name: profile.fullName,
    initials: initialsOf(profile.fullName),
    email: profile.email,
    roleId: profile.roleId,
  };
}

export function useCurrentUser(): ResolvedIdentity {
  const profile = useSessionStore((s) => s.profile);
  return fromProfile(profile);
}

// Non-hook variant for plain functions/store actions (same pattern as
// dashboardService.ts's getState() reads) — e.g. financeStore.addExpense
// needs "who submitted this" outside of a component render.
export function getCurrentUser(): ResolvedIdentity {
  return fromProfile(useSessionStore.getState().profile);
}
