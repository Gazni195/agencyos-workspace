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
import type { Client, ClientHealth } from "@/data/crm";
import { owners, initialsOf } from "@/data/crm";

export function NewClientDialog({ onCreate }: { onCreate: (client: Client) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [owner, setOwner] = useState(owners[0] ?? "");
  const [mrr, setMrr] = useState("");
  const [health, setHealth] = useState<ClientHealth>("healthy");
  const [contact, setContact] = useState("");

  const reset = () => {
    setName("");
    setIndustry("");
    setOwner(owners[0] ?? "");
    setMrr("");
    setHealth("healthy");
    setContact("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) {
      toast.error("Client name and industry are required.");
      return;
    }
    const client: Client = {
      id: `cl-${Date.now()}`,
      name: name.trim(),
      industry: industry.trim(),
      owner,
      mrr: Number(mrr) || 0,
      health,
      projects: 0,
      logo: initialsOf(name.trim()),
      since: new Date().toISOString().slice(0, 10),
      address: "—",
      website: "—",
      notes: contact ? `Primary contact: ${contact}` : "",
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
            <div className="grid gap-2">
              <Label htmlFor="client-mrr">Monthly recurring revenue (USD)</Label>
              <Input
                id="client-mrr"
                type="number"
                min="0"
                value={mrr}
                onChange={(e) => setMrr(e.target.value)}
                placeholder="15000"
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
