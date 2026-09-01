import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/frontend/components/ui/dropdown-menu";
import { DeleteConfirmDialog } from "@/shared/frontend/components/DeleteConfirmDialog";
import { EditClientDialog } from "@/modules/clients/frontend/components/EditClientDialog";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import type { Client } from "@/modules/clients/types";

export function ClientRowActions({ client }: { client: Client }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const updateClient = useClientsStore((s) => s.updateClient);
  const removeClient = useClientsStore((s) => s.removeClient);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Actions for ${client.name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditClientDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={(patch) => updateClient(client.id, patch)}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${client.name}?`}
        description="This removes the client and its association from your workspace. This cannot be undone."
        onConfirm={() => {
          removeClient(client.id);
          toast.success(`${client.name} deleted`);
        }}
      />
    </div>
  );
}
