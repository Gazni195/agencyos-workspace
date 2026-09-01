import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/shared/frontend/components/ui/button";
import { usePermissions } from "@/shared/frontend/hooks/usePermissions";
import type { permissionModules } from "@/modules/settings/types";

type PermissionModule = (typeof permissionModules)[number];

// Wraps a whole module's route (one per top-level sidebar item) and blocks
// it when the active role's permission matrix doesn't grant view access —
// the enforcement side of Settings -> Roles & Permissions, so toggling a
// checkbox there actually changes what's reachable instead of just
// changing what a checkbox says.
export function RequireModuleAccess({
  module,
  children,
}: {
  module: PermissionModule;
  children: ReactNode;
}) {
  const { can, role } = usePermissions();

  if (can(module, "view")) return <>{children}</>;

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" />
      </span>
      <p className="text-lg font-semibold">Access restricted</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {role?.name ?? "Your role"} doesn't have access to this module. Ask an admin to grant it in
        Settings → Roles & Permissions.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link to="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
