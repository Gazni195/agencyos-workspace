import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/frontend/components/ui/dialog";
import { Input } from "@/shared/frontend/components/ui/input";
import { Label } from "@/shared/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/frontend/components/ui/select";
import type { StoreLead } from "@/modules/leads/frontend/store/leadsStore";
import { useLeadsStore } from "@/modules/leads/frontend/store/leadsStore";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";

// A curated starting vocabulary — data/crm.ts's `sources` used to be
// derived once, at import time, from the (permanently empty) static leads
// seed, so this dropdown had zero options no matter how many real leads
// existed (same bug fixed for reports.leads.tsx in an earlier phase, missed
// here). Union it with whatever sources are actually in use so the list
// stays real once leads start using something outside this starter set.
const DEFAULT_SOURCES = ["Referral", "Inbound", "Outbound", "Event", "Partner", "Website"];

export function LeadFormDialog({ onCreate }: { onCreate: (lead: StoreLead) => void }) {
  const employees = useEmployeesStore((s) => s.employees);
  const owners = employees.map((e) => e.name);
  const leads = useLeadsStore((s) => s.leads);
  const sources = useMemo(
    () => Array.from(new Set([...DEFAULT_SOURCES, ...leads.map((l) => l.source)])),
    [leads],
  );
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState("");
  const [owner, setOwner] = useState(owners[0] ?? "");
  const [source, setSource] = useState(sources[0] ?? "Inbound");

  const reset = () => {
    setCompany("");
    setContact("");
    setEmail("");
    setValue("");
    setOwner(owners[0] ?? "");
    setSource(sources[0] ?? "Inbound");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contact.trim()) {
      toast.error("Company and contact name are required.");
      return;
    }
    const lead: StoreLead = {
      id: `ld-${Date.now()}`,
      company: company.trim(),
      contact: contact.trim(),
      email:
        email.trim() ||
        `${contact.trim().toLowerCase().replace(/\s+/g, ".")}@${company.trim().toLowerCase().replace(/\s+/g, "")}.com`,
      phone: "—",
      stage: "New",
      value: Number(value) || 0,
      owner,
      source,
      nextAction: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      createdOn: new Date().toISOString().slice(0, 10),
      notes: [],
    };
    onCreate(lead);
    toast.success(`${lead.company} added to pipeline`);
    setOpen(false);
    reset();
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
          <Plus className="size-4" />
          New lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New lead</DialogTitle>
            <DialogDescription>Add a new opportunity to the pipeline.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-contact">Contact name</Label>
              <Input
                id="lead-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional — auto-generated if left blank"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lead-owner">Owner</Label>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger id="lead-owner">
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
                <Label htmlFor="lead-source">Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger id="lead-source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-value">Estimated deal value (USD)</Label>
              <Input
                id="lead-value"
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="50000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
