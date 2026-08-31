import { useSessionStore } from "@/store/sessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { PermissionAction, permissionModules } from "@/data/workspace";

type PermissionModule = (typeof permissionModules)[number];

export function usePermissions() {
  const roleId = useSessionStore((s) => s.currentRoleId);
  const setRole = useSessionStore((s) => s.setRole);
  const permissionMatrix = useSettingsStore((s) => s.permissionMatrix);
  const roles = useSettingsStore((s) => s.roles);
  const role = roles.find((r) => r.id === roleId);

  const can = (module: PermissionModule, action: PermissionAction) =>
    permissionMatrix[roleId]?.[module]?.[action] ?? false;

  return { roleId, role, roles, setRole, can };
}
