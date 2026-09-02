import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { EditIconButton } from "@/components/settings/OrganizationDialogs";
import {
  NewClientPackageDialog,
  EditClientPackageDialog,
} from "@/components/settings/ClientPackageDialogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSettingsStore } from "@/store/settingsStore";
import { money } from "@/data/agency";

export const Route = createFileRoute("/settings/client-packages")({
  head: () => ({
    meta: [
      { title: "Client Packages — AgencyOS Settings" },
      { name: "description", content: "Manage the retainer and one-time package catalog." },
    ],
  }),
  component: ClientPackagesPage,
});

function ClientPackagesPage() {
  const clientPackages = useSettingsStore((s) => s.clientPackages);
  const addClientPackage = useSettingsStore((s) => s.addClientPackage);
  const updateClientPackage = useSettingsStore((s) => s.updateClientPackage);
  const removeClientPackage = useSettingsStore((s) => s.removeClientPackage);

  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editing = clientPackages.find((p) => p.id === editId) ?? null;
  const deleting = clientPackages.find((p) => p.id === deleteId) ?? null;

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <p className="font-semibold">Client packages</p>
          <p className="text-xs text-muted-foreground">
            The catalog offered when creating or editing a client account.
          </p>
        </div>
        <NewClientPackageDialog onCreate={addClientPackage} />
      </div>
      {clientPackages.length === 0 ? (
        <p className="p-6 text-sm text-muted-foreground">
          No packages yet. Add one so it can be selected when creating a client.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Default price</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientPackages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {p.type === "monthly" ? "Monthly" : "One-time"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {money(p.defaultPrice)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <EditIconButton onClick={() => setEditId(p.id)} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editing && (
        <EditClientPackageDialog
          pkg={editing}
          open={!!editId}
          onOpenChange={(open) => !open && setEditId(null)}
          onSave={(patch) => updateClientPackage(editing.id, patch)}
        />
      )}
      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`Delete ${deleting?.name}?`}
        description="Clients already on this package keep their price and name — it just won't be offered for new selections."
        onConfirm={() => {
          if (!deleting) return;
          removeClientPackage(deleting.id);
          toast.success(`${deleting.name} deleted`);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
