import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/data/agency";
import { clients } from "@/data/agency";

type DraftLine = { id: string; description: string; quantity: number; rate: number };

export function InvoiceFormDialog({ onCreate }: { onCreate?: (client: string, total: number) => void }) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([{ id: "l-1", description: "", quantity: 1, rate: 0 }]);

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.rate, 0);

  const addLine = () =>
    setLines((prev) => [...prev, { id: `l-${prev.length + 1}-${Date.now()}`, description: "", quantity: 1, rate: 0 }]);
  const removeLine = (id: string) => setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  const updateLine = (id: string, patch: Partial<DraftLine>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const reset = () => {
    setClient("");
    setLines([{ id: "l-1", description: "", quantity: 1, rate: 0 }]);
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
        <Button className="gap-2">
          <Plus className="size-4" /> New invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New invoice</DialogTitle>
          <DialogDescription>Add line items and issue a new invoice to a client.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Line items</Label>
            <div className="space-y-2">
              {lines.map((line) => (
                <div key={line.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2">
                  <Input
                    className="min-w-40 flex-1"
                    placeholder="Description"
                    value={line.description}
                    onChange={(e) => updateLine(line.id, { description: e.target.value })}
                  />
                  <Input
                    type="number"
                    min={0}
                    className="w-20"
                    placeholder="Qty"
                    value={line.quantity}
                    onChange={(e) => updateLine(line.id, { quantity: Number(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    min={0}
                    className="w-28"
                    placeholder="Rate"
                    value={line.rate}
                    onChange={(e) => updateLine(line.id, { rate: Number(e.target.value) || 0 })}
                  />
                  <span className="w-24 text-right text-sm font-medium tabular-nums">
                    {money(line.quantity * line.rate)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeLine(line.id)}
                    aria-label="Remove line item"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={addLine}>
              <Plus className="size-3.5" /> Add line item
            </Button>
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea placeholder="Optional notes for the client" />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-lg font-bold tabular-nums">{money(subtotal)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!client) {
                toast.error("Select a client before saving.");
                return;
              }
              onCreate?.(client, subtotal);
              toast.success(`Invoice created for ${client}`);
              setOpen(false);
              reset();
            }}
          >
            Save invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
