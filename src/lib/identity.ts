// Resolves a signed-in email address to a real identity — either the
// seeded demo owner account or a real employee record created through the
// Employees module. Shared by login (to authenticate) and by the header/
// dashboard (to display who's actually signed in) so both use the same
// source of truth instead of two copies of the same lookup.
import { currentUser } from "@/mock/dashboard";
import type { Employee } from "@/data/agency";

export type ResolvedIdentity = {
  name: string;
  initials: string;
  email: string;
  roleId: string;
};

export function resolveIdentityByEmail(
  email: string,
  employees: Employee[],
): ResolvedIdentity | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === currentUser.email.toLowerCase()) {
    return {
      name: currentUser.name,
      initials: currentUser.initials,
      email: currentUser.email,
      roleId: currentUser.roleId,
    };
  }
  const employee = employees.find((e) => e.email.toLowerCase() === normalized);
  if (employee) {
    return {
      name: employee.name,
      initials: employee.initials,
      email: employee.email,
      roleId: employee.roleId,
    };
  }
  return null;
}

export const fallbackIdentity: ResolvedIdentity = {
  name: currentUser.name,
  initials: currentUser.initials,
  email: currentUser.email,
  roleId: currentUser.roleId,
};
