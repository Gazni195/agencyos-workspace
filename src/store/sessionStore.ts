// Frontend-only identity and permissions for the AgencyOS foundation.
// currentRoleId can be locally overridden via AppShell's "Preview role"
// switcher; replace this store with the real account service in a later phase.
import { create } from "zustand";
import { currentUser } from "@/mock";
import {
  defaultPermissionMatrix,
  type PermissionAction,
  permissionModules,
} from "@/data/workspace";

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
  loadProfile: (userId: string, email?: string, fullName?: string) => Promise<void>;
  clear: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  profile: {
    id: "mock-user",
    email: currentUser.email,
    fullName: currentUser.name,
    roleId: currentUser.roleId,
  },
  currentRoleId: currentUser.roleId,
  permissionsByRole: defaultPermissionMatrix(),
  setRole: (roleId) => set({ currentRoleId: roleId }),
  loadProfile: async (userId, email = currentUser.email, fullName = currentUser.name) => {
    const profile: Profile = {
      id: userId,
      email,
      fullName,
      roleId: currentUser.roleId,
    };
    set({ profile, currentRoleId: profile.roleId });
  },
  clear: () => set({ profile: null, currentRoleId: null, permissionsByRole: {} }),
}));
