// Real role + permissions for the signed-in account, loaded from Supabase
// once authStore resolves who's signed in (see
// supabase/migrations/0001_roles_and_profiles.sql). currentRoleId can be
// locally overridden via setRole — that's AppShell's "Preview role"
// switcher, kept from the earlier demo build so anyone can see the RBAC
// matrix working without a second account. It only affects which
// permission set the frontend uses for showing/hiding UI; it never touches
// the database, so Supabase's Row Level Security still enforces the
// account's real role regardless of what's previewed here.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import type { PermissionAction, permissionModules } from "@/data/workspace";

type ModuleName = (typeof permissionModules)[number];
type PermissionsForRole = Record<ModuleName, Record<PermissionAction, boolean>>;

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
};

type SessionState = {
  profile: Profile | null;
  currentRoleId: string | null;
  permissionsByRole: Record<string, PermissionsForRole>;
  setRole: (roleId: string) => void;
  loadProfile: (userId: string) => Promise<void>;
  clear: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  profile: null,
  currentRoleId: null,
  permissionsByRole: {},
  setRole: (roleId) => set({ currentRoleId: roleId }),
  loadProfile: async (userId) => {
    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role_id")
      .eq("id", userId)
      .single();
    if (profileError || !profileRow) {
      console.error("Failed to load profile", profileError);
      return;
    }

    const profile: Profile = {
      id: profileRow.id as string,
      email: profileRow.email as string,
      fullName: profileRow.full_name as string,
      roleId: profileRow.role_id as string,
    };

    // Small table (one row per role x module) — loading all of it once and
    // indexing client-side means the "Preview role" switcher above can
    // flip roles instantly with no extra network round-trip.
    const { data: permRows, error: permError } = await supabase
      .from("role_permissions")
      .select("role_id, module, can_view, can_edit, can_delete");
    if (permError) {
      console.error("Failed to load role permissions", permError);
    }

    const permissionsByRole: Record<string, PermissionsForRole> = {};
    for (const row of permRows ?? []) {
      const bucket = (permissionsByRole[row.role_id as string] ??= {} as PermissionsForRole);
      bucket[row.module as ModuleName] = {
        view: row.can_view as boolean,
        edit: row.can_edit as boolean,
        delete: row.can_delete as boolean,
      };
    }

    set({ profile, currentRoleId: profile.roleId, permissionsByRole });
  },
  clear: () => set({ profile: null, currentRoleId: null, permissionsByRole: {} }),
}));
