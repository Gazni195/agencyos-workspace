import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useLeadsStore, type StoreLead } from "@/store/leadsStore";
import type { PackageType } from "@/data/crm";

export function ConvertLeadDialog({
  lead,
  open,
  onOpenChange,
}: {
  lead: StoreLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const convertToClient = useLeadsStore((s) => s.convertToClient);
  const [industry, setIndustry] = useState("");
  const [packageType, setPackageType] = useState<PackageType>("monthly");
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState("");

  if (!lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = convertToClient(lead.id, {
      industry: industry.trim(),
      packageType,
      packageName: packageName.trim(),
      packagePrice: Number(packagePrice) || 0,
    });
    if (!client) return;
    toast.success(`${lead.company} converted to a client`);
    onOpenChange(false);
    setIndustry("");
    setPackageType("monthly");
    setPackageName("");
    setPackagePrice("");
    navigate({ to: "/clients/$clientId", params: { clientId: client.id } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Convert {lead.company} to a client</DialogTitle>
            <DialogDescription>
              This creates a new client account from this lead and marks it won. The lead stays in
              your history with a link to the new account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="convert-industry">Industry</Label>
              <Input
                id="convert-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Retail"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="convert-package-type">Package type</Label>
                <Select value={packageType} onValueChange={(v) => setPackageType(v as PackageType)}>
                  <SelectTrigger id="convert-package-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly recurring</SelectItem>
                    <SelectItem value="one-time">One-time project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="convert-price">
                  {packageType === "monthly" ? "Monthly price (USD)" : "Project price (USD)"}
                </Label>
                <Input
                  id="convert-price"
                  type="number"
                  min="0"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  placeholder="15000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="convert-package-name">Package name</Label>
              <Input
                id="convert-package-name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Growth Retainer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-1.5">
              <ArrowRightCircle className="size-4" /> Convert to client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
