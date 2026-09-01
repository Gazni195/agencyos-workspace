// Who's actually signed in right now — resolved from the persisted auth
// session (see authStore) against the demo owner account and the live
// employee directory, via the same lookup login uses. Use this anywhere
// the UI needs to display "you" (header, greetings, "submitted by" on
// records created in-session) instead of the old hardcoded currentUser
// import, so a different employee signing in sees themselves, not
// whichever identity happened to be the seed.
import { useAuthStore } from "@/modules/auth/frontend/store/authStore";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import {
  fallbackIdentity,
  resolveIdentityByEmail,
  type ResolvedIdentity,
} from "@/shared/frontend/utils/identity";

export function useCurrentUser(): ResolvedIdentity {
  const email = useAuthStore((s) => s.email);
  const employees = useEmployeesStore((s) => s.employees);
  if (!email) return fallbackIdentity;
  return resolveIdentityByEmail(email, employees) ?? fallbackIdentity;
}

// Non-hook variant for plain functions/store actions (same pattern as
// dashboardService.ts's getState() reads) — e.g. financeStore.addExpense
// needs "who submitted this" outside of a component render.
export function getCurrentUser(): ResolvedIdentity {
  const email = useAuthStore.getState().email;
  if (!email) return fallbackIdentity;
  const employees = useEmployeesStore.getState().employees;
  return resolveIdentityByEmail(email, employees) ?? fallbackIdentity;
}
