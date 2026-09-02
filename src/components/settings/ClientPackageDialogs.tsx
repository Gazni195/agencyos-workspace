import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PackageType } from "@/data/crm";
import type { ClientPackage } from "@/data/workspace";

export function NewClientPackageDialog({ onCreate }: { onCreate: (pkg: ClientPackage) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<PackageType>("monthly");
  const [defaultPrice, setDefaultPrice] = useState("");

  const reset = () => {
    setName("");
    setType("monthly");
    setDefaultPrice("");
  };

  const handleSubmit = () => {
    if (!name.trim() || !defaultPrice) {
      toast.error("Name and default price are required.");
      return;
    }
    onCreate({
      id: `pkg-${Date.now()}`,
      name: name.trim(),
      type,
      defaultPrice: Number(defaultPrice),
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
          <Plus className="size-4" /> Add package
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add client package</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="pkg-name">Name</Label>
            <Input
              id="pkg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Growth Retainer"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as PackageType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pkg-price">Default price</Label>
              <Input
                id="pkg-price"
                type="number"
                min="0"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                placeholder="2500"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add package</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditClientPackageDialog({
  pkg,
  open,
  onOpenChange,
  onSave,
}: {
  pkg: ClientPackage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: Partial<ClientPackage>) => void;
}) {
  const [name, setName] = useState(pkg.name);
  const [type, setType] = useState<PackageType>(pkg.type);
  const [defaultPrice, setDefaultPrice] = useState(String(pkg.defaultPrice));

  useEffect(() => {
    if (open) {
      setName(pkg.name);
      setType(pkg.type);
      setDefaultPrice(String(pkg.defaultPrice));
    }
  }, [open, pkg]);

  const handleSubmit = () => {
    if (!name.trim() || !defaultPrice) {
      toast.error("Name and default price are required.");
      return;
    }
    onSave({ name: name.trim(), type, defaultPrice: Number(defaultPrice) });
    toast.success("Package updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit client package</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="edit-pkg-name">Name</Label>
            <Input id="edit-pkg-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as PackageType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-pkg-price">Default price</Label>
              <Input
                id="edit-pkg-price"
                type="number"
                min="0"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
