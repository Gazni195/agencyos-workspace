import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { employees } from "@/data/agency";
import { useClientsStore } from "@/store/clientsStore";
import type { DeliveryProject, ProjectStatus } from "@/data/delivery";

export function NewProjectDialog({ onCreate }: { onCreate: (project: DeliveryProject) => void }) {
  const clients = useClientsStore((s) => s.clients);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [lead, setLead] = useState("");
  const [budget, setBudget] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("on-track");

  const reset = () => {
    setName("");
    setClient("");
    setLead("");
    setBudget("");
    setDue("");
    setStatus("on-track");
  };

  const handleSubmit = () => {
    if (!name.trim() || !client || !lead || !budget || !due) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const leadEmployee = employees.find((e) => e.name === lead);
    const project: DeliveryProject = {
      id: `pr-${Date.now()}`,
      name: name.trim(),
      client,
      lead,
      leadInitials: leadEmployee?.initials ?? lead.slice(0, 2).toUpperCase(),
      team: leadEmployee ? [leadEmployee.id] : [],
      progress: 0,
      budget: Number(budget),
      spend: 0,
      status,
      startDate: new Date().toISOString().slice(0, 10),
      due,
      description: "New project — add a description in the detail view.",
      health: status === "delayed" ? "red" : status === "at-risk" ? "yellow" : "green",
    };
    onCreate(project);
    toast.success(`${project.name} created`);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="size-4" /> New project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>Create a new project workspace for a client.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="np-name">Project name</Label>
            <Input
              id="np-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Holiday Campaign"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
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
          <div className="grid gap-1.5">
            <Label>Project lead</Label>
            <Select value={lead} onValueChange={setLead}>
              <SelectTrigger>
                <SelectValue placeholder="Select lead" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.name}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="np-budget">Budget (USD)</Label>
              <Input
                id="np-budget"
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="50000"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="np-due">Due date</Label>
              <Input id="np-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-track">On track</SelectItem>
                <SelectItem value="at-risk">At risk</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
