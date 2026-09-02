// Single source of truth for "which permission role is currently active"
// (see usePermissions / RequireModuleAccess). Since Phase G, real login
// (src/frontend/routes/login.tsx) sets this from the signed-in identity's actual
// role on every sign-in — it's no longer just a placeholder default. The
// "Preview role" switcher in AppShell's header still overrides it in the
// same running session, on purpose: it's how anyone can see the RBAC
// matrix from Settings -> Roles & Permissions actually working without
// needing a second account to sign in as.
import { create } from "zustand";
import { currentUser } from "@/shared/frontend/config/appData";

type SessionState = {
  currentRoleId: string;
  setRole: (roleId: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  currentRoleId: currentUser.roleId,
  setRole: (roleId) => set({ currentRoleId: roleId }),
}));
