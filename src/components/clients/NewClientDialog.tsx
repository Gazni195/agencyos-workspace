import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client, ClientHealth, PackageType } from "@/data/crm";
import { initialsOf } from "@/data/crm";
import { useEmployeesStore } from "@/store/employeesStore";
import { useSettingsStore } from "@/store/settingsStore";

const CUSTOM = "custom";

export function NewClientDialog({ onCreate }: { onCreate: (client: Client) => void }) {
  const employees = useEmployeesStore((s) => s.employees);
  const owners = employees.map((e) => e.name);
  const clientPackages = useSettingsStore((s) => s.clientPackages);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [owner, setOwner] = useState(owners[0] ?? "");
  const [packageType, setPackageType] = useState<PackageType>("monthly");
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [health, setHealth] = useState<ClientHealth>("healthy");
  const [contact, setContact] = useState("");

  const reset = () => {
    setName("");
    setIndustry("");
    setOwner(owners[0] ?? "");
    setPackageType("monthly");
    setPackageName("");
    setPackagePrice("");
    setHealth("healthy");
    setContact("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) {
      toast.error("Client name and industry are required.");
      return;
    }
    const price = Number(packagePrice) || 0;
    const client: Client = {
      id: `cl-${Date.now()}`,
      name: name.trim(),
      industry: industry.trim(),
      owner,
      mrr: packageType === "monthly" ? price : 0,
      health,
      logo: initialsOf(name.trim()),
      since: new Date().toISOString().slice(0, 10),
      address: "—",
      website: "—",
      notes: contact ? `Primary contact: ${contact}` : "",
      packageType,
      packageName: packageName.trim() || "General",
      packagePrice: price,
    };
    onCreate(client);
    toast.success(`${client.name} added to clients`);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          New client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
            <DialogDescription>Add a new account to your client directory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client-name">Client name</Label>
              <Input
                id="client-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-industry">Industry</Label>
              <Input
                id="client-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Retail"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client-owner">Owner</Label>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger id="client-owner">
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
                <Label htmlFor="client-health">Health</Label>
                <Select value={health} onValueChange={(v) => setHealth(v as ClientHealth)}>
                  <SelectTrigger id="client-health">
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
            {clientPackages.length > 0 && (
              <div className="grid gap-2">
                <Label>Package template</Label>
                <Select
                  value={CUSTOM}
                  onValueChange={(v) => {
                    if (v === CUSTOM) return;
                    const pkg = clientPackages.find((p) => p.id === v);
                    if (!pkg) return;
                    setPackageType(pkg.type);
                    setPackagePrice(String(pkg.defaultPrice));
                    setPackageName(pkg.name);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start from a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CUSTOM}>Custom</SelectItem>
                    {clientPackages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client-package-type">Package type</Label>
                <Select value={packageType} onValueChange={(v) => setPackageType(v as PackageType)}>
                  <SelectTrigger id="client-package-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly recurring</SelectItem>
                    <SelectItem value="one-time">One-time project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-package-price">
                  {packageType === "monthly" ? "Monthly price (USD)" : "Project price (USD)"}
                </Label>
                <Input
                  id="client-package-price"
                  type="number"
                  min="0"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  placeholder="15000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-package-name">Package name</Label>
              <Input
                id="client-package-name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Growth Retainer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-contact">Primary contact</Label>
              <Input
                id="client-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
