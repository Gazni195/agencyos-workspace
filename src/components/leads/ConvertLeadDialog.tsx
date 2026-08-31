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
import { useLeadsStore, type StoreLead } from "@/store/leadsStore";

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
  const [mrr, setMrr] = useState("");

  if (!lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = convertToClient(lead.id, { industry: industry.trim(), mrr: Number(mrr) || 0 });
    if (!client) return;
    toast.success(`${lead.company} converted to a client`);
    onOpenChange(false);
    setIndustry("");
    setMrr("");
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
            <div className="grid gap-2">
              <Label htmlFor="convert-mrr">Monthly recurring revenue (USD)</Label>
              <Input
                id="convert-mrr"
                type="number"
                min="0"
                value={mrr}
                onChange={(e) => setMrr(e.target.value)}
                placeholder="15000"
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
