import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
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
import { permissionModules, type PermissionAction } from "@/data/workspace";

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
  const roles = useSettingsStore((s) => s.roles);
  const addRole = useSettingsStore((s) => s.addRole);
  const removeRole = useSettingsStore((s) => s.removeRole);
  const permissionMatrix = useSettingsStore((s) => s.permissionMatrix);
  const togglePermission = useSettingsStore((s) => s.togglePermission);
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!roles.find((r) => r.id === roleId) && roles[0]) setRoleId(roles[0].id);
  }, [roles, roleId]);

  const role = roles.find((r) => r.id === roleId);
  const roleMatrix = permissionMatrix[roleId];
  const deleting = roles.find((r) => r.id === deleteId) ?? null;

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <NewRoleDialog onCreate={addRole} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <div
            key={r.id}
            className={cn(
              "surface-card relative flex flex-col gap-1.5 p-4 text-left transition-colors",
              roleId === r.id ? "ring-2 ring-primary" : "hover:bg-muted/40",
            )}
          >
            <button
              type="button"
              onClick={() => setRoleId(r.id)}
              className="flex flex-col gap-1.5 text-left"
            >
              <div className="flex items-center justify-between gap-2 pr-6">
                <p className="font-semibold">{r.name}</p>
                <Badge variant="secondary" className="gap-1">
                  <Users className="size-3" />
                  {r.users}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{r.description}</p>
            </button>
            {roles.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 size-6 text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${r.name}`}
                onClick={() => setDeleteId(r.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
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

      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`Delete ${deleting?.name}?`}
        description="Its permission settings are removed. This does not change anyone's current access until real RBAC enforcement is wired up."
        onConfirm={() => {
          if (!deleting) return;
          removeRole(deleting.id);
          toast.success(`${deleting.name} deleted`);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

function NewRoleDialog({
  onCreate,
}: {
  onCreate: (role: { id: string; name: string; users: number; description: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Role name is required.");
      return;
    }
    onCreate({
      id: `role-${Date.now()}`,
      name: name.trim(),
      users: 0,
      description: description.trim() || "No description yet.",
    });
    toast.success(`${name.trim()} added`);
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" /> New role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New role</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="role-name">Name</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Account Manager"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this role can typically do"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
