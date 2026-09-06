import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { PermissionAction, permissionModules } from "@/data/workspace";

type PermissionModule = (typeof permissionModules)[number];

export function usePermissions() {
  const roleId = useSessionStore((s) => s.currentRoleId) ?? "";
  const setRole = useSessionStore((s) => s.setRole);
  const permissionsByRole = useSessionStore((s) => s.permissionsByRole);
  // Role catalog (id/name/description for the "Preview role" switcher) is
  // Supabase-backed too (settingsStore.fetchRoles), so a role added in
  // Settings shows up here immediately. Actual access checks below still
  // use sessionStore's own snapshot of role_permissions, loaded once at
  // sign-in — kept separate so the switcher never depends on Settings
  // having loaded first.
  const roles = useSettingsStore((s) => s.roles);
  const role = roles.find((r) => r.id === roleId);

  const can = (module: PermissionModule, action: PermissionAction) =>
    permissionsByRole[roleId]?.[module]?.[action] ?? false;

  return { roleId, role, roles, setRole, can };
}
