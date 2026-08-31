// Stand-in for a real session until Phase G wires up backend auth. There is
// no login/logout that changes this today — AUTH_ROUTES in __root.tsx just
// swap the page chrome. What this store gives the rest of the app is a
// single source of truth for "which role is currently active", so the
// permission matrix in Settings -> Roles & Permissions has something real
// to gate against right now (see usePermissions / RequireModuleAccess)
// instead of being a display-only settings screen.
import { create } from "zustand";
import { currentUser } from "@/mock/dashboard";

type SessionState = {
  currentRoleId: string;
  setRole: (roleId: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  currentRoleId: currentUser.roleId,
  setRole: (roleId) => set({ currentRoleId: roleId }),
}));
