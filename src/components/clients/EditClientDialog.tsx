import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client, ClientHealth, PackageType } from "@/data/crm";
import { useEmployeesStore } from "@/store/employeesStore";

export function EditClientDialog({
  client,
  open,
  onOpenChange,
  onSave,
  trigger,
}: {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: Partial<Client>) => void;
  trigger?: ReactNode;
}) {
  const employees = useEmployeesStore((s) => s.employees);
  const owners = employees.map((e) => e.name);
  const [name, setName] = useState(client.name);
  const [industry, setIndustry] = useState(client.industry);
  const [owner, setOwner] = useState(client.owner);
  const [packageType, setPackageType] = useState<PackageType>(client.packageType);
  const [packageName, setPackageName] = useState(client.packageName);
  const [packagePrice, setPackagePrice] = useState(String(client.packagePrice));
  const [health, setHealth] = useState<ClientHealth>(client.health);
  const [website, setWebsite] = useState(client.website);
  const [address, setAddress] = useState(client.address);

  useEffect(() => {
    if (!open) return;
    setName(client.name);
    setIndustry(client.industry);
    setOwner(client.owner);
    setPackageType(client.packageType);
    setPackageName(client.packageName);
    setPackagePrice(String(client.packagePrice));
    setHealth(client.health);
    setWebsite(client.website);
    setAddress(client.address);
  }, [open, client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) {
      toast.error("Client name and industry are required.");
      return;
    }
    const price = Number(packagePrice) || 0;
    onSave({
      name: name.trim(),
      industry: industry.trim(),
      owner,
      mrr: packageType === "monthly" ? price : 0,
      health,
      website: website.trim() || "—",
      address: address.trim() || "—",
      packageType,
      packageName: packageName.trim() || "General",
      packagePrice: price,
    });
    toast.success(`${name.trim()} updated`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit client</DialogTitle>
            <DialogDescription>Update this account's details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-client-name">Client name</Label>
              <Input id="edit-client-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-client-industry">Industry</Label>
              <Input
                id="edit-client-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-client-owner">Owner</Label>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger id="edit-client-owner">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-health">Health</Label>
                <Select value={health} onValueChange={(v) => setHealth(v as ClientHealth)}>
                  <SelectTrigger id="edit-client-health">
                    <SelectValue placeholder="Select health" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="at-risk">At risk</SelectItem>
                    <SelectItem value="churn-risk">Churn risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-client-package-type">Package type</Label>
                <Select value={packageType} onValueChange={(v) => setPackageType(v as PackageType)}>
                  <SelectTrigger id="edit-client-package-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly recurring</SelectItem>
                    <SelectItem value="one-time">One-time project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-package-price">
                  {packageType === "monthly" ? "Monthly price (USD)" : "Project price (USD)"}
                </Label>
                <Input
                  id="edit-client-package-price"
                  type="number"
                  min="0"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-client-package-name">Package name</Label>
              <Input
                id="edit-client-package-name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-client-website">Website</Label>
                <Input
                  id="edit-client-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-address">Address</Label>
                <Input
                  id="edit-client-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
