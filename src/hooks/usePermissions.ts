import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { PermissionAction, permissionModules } from "@/data/workspace";

type PermissionModule = (typeof permissionModules)[number];

export function usePermissions() {
  const roleId = useSessionStore((s) => s.currentRoleId) ?? "";
  const setRole = useSessionStore((s) => s.setRole);
  const permissionsByRole = useSessionStore((s) => s.permissionsByRole);
  // Role catalog (id/name/description for the "Preview role" switcher) is
  // still the same fixed list Settings -> Roles & Permissions has always
  // shown; that screen's own move to real Supabase-backed role management
  // is a later module. Actual access checks below use the live
  // Supabase-loaded grid from sessionStore, not this mock.
  const roles = useSettingsStore((s) => s.roles);
  const role = roles.find((r) => r.id === roleId);

  const can = (module: PermissionModule, action: PermissionAction) =>
    permissionsByRole[roleId]?.[module]?.[action] ?? false;

  return { roleId, role, roles, setRole, can };
}
