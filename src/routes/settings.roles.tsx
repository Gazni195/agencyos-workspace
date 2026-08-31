import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";
import { permissionModules, rolesSeed, type PermissionAction } from "@/data/workspace";

export const Route = createFileRoute("/settings/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Permissions — AgencyOS Settings" },
      { name: "description", content: "Manage role access across every module." },
    ],
  }),
  component: RolesPage,
});

const actions: PermissionAction[] = ["view", "edit", "delete"];

function RolesPage() {
  const permissionMatrix = useSettingsStore((s) => s.permissionMatrix);
  const togglePermission = useSettingsStore((s) => s.togglePermission);
  const [roleId, setRoleId] = useState(rolesSeed[0]?.id ?? "");

  const role = rolesSeed.find((r) => r.id === roleId);
  const roleMatrix = permissionMatrix[roleId];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rolesSeed.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRoleId(r.id)}
            className={cn(
              "surface-card flex flex-col gap-1.5 p-4 text-left transition-colors",
              roleId === r.id ? "ring-2 ring-primary" : "hover:bg-muted/40",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{r.name}</p>
              <Badge variant="secondary" className="gap-1">
                <Users className="size-3" />
                {r.users}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{r.description}</p>
          </button>
        ))}
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Permissions — {role?.name}</p>
          <p className="text-xs text-muted-foreground">
            Toggle view, edit and delete access per module.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                {actions.map((a) => (
                  <TableHead key={a} className="text-center capitalize">
                    {a}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionModules.map((mod) => (
                <TableRow key={mod}>
                  <TableCell className="font-medium">{mod}</TableCell>
                  {actions.map((action) => (
                    <TableCell key={action} className="text-center">
                      <Checkbox
                        checked={roleMatrix?.[mod]?.[action] ?? false}
                        onCheckedChange={() => togglePermission(roleId, mod, action)}
                        aria-label={`${role?.name} ${action} ${mod}`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
