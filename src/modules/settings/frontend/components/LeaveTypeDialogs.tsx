import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/frontend/components/ui/dialog";
import { Input } from "@/shared/frontend/components/ui/input";
import { Label } from "@/shared/frontend/components/ui/label";
import { Checkbox } from "@/shared/frontend/components/ui/checkbox";
import type { LeaveType } from "@/modules/settings/types";

const colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
const nextColor = (existing: number) => colors[existing % colors.length] ?? "chart-1";

export function NewLeaveTypeDialog({
  existingCount,
  onCreate,
}: {
  existingCount: number;
  onCreate: (t: LeaveType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [annualAllowance, setAnnualAllowance] = useState("");
  const [carryOver, setCarryOver] = useState(false);

  const reset = () => {
    setName("");
    setAnnualAllowance("");
    setCarryOver(false);
  };

  const handleSubmit = () => {
    if (!name.trim() || !annualAllowance) {
      toast.error("Name and annual allowance are required.");
      return;
    }
    onCreate({
      id: `lt-${Date.now()}`,
      name: name.trim(),
      annualAllowance: Number(annualAllowance),
      carryOver,
      color: nextColor(existingCount),
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
          <Plus className="size-4" /> Add leave type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add leave type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="lt-name">Name</Label>
            <Input
              id="lt-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bereavement"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lt-allowance">Annual allowance (days)</Label>
            <Input
              id="lt-allowance"
              type="number"
              min="0"
              value={annualAllowance}
              onChange={(e) => setAnnualAllowance(e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="lt-carryover"
              checked={carryOver}
              onCheckedChange={(v) => setCarryOver(v === true)}
            />
            <Label htmlFor="lt-carryover" className="font-normal">
              Unused days carry over to next year
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add leave type</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditLeaveTypeDialog({
  leaveType,
  open,
  onOpenChange,
  onSave,
}: {
  leaveType: LeaveType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: Partial<LeaveType>) => void;
}) {
  const [name, setName] = useState(leaveType.name);
  const [annualAllowance, setAnnualAllowance] = useState(String(leaveType.annualAllowance));
  const [carryOver, setCarryOver] = useState(leaveType.carryOver);

  useEffect(() => {
    if (open) {
      setName(leaveType.name);
      setAnnualAllowance(String(leaveType.annualAllowance));
      setCarryOver(leaveType.carryOver);
    }
  }, [open, leaveType]);

  const handleSubmit = () => {
    if (!name.trim() || !annualAllowance) {
      toast.error("Name and annual allowance are required.");
      return;
    }
    onSave({ name: name.trim(), annualAllowance: Number(annualAllowance), carryOver });
    toast.success("Leave type updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit leave type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="edit-lt-name">Name</Label>
            <Input id="edit-lt-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-lt-allowance">Annual allowance (days)</Label>
            <Input
              id="edit-lt-allowance"
              type="number"
              min="0"
              value={annualAllowance}
              onChange={(e) => setAnnualAllowance(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="edit-lt-carryover"
              checked={carryOver}
              onCheckedChange={(v) => setCarryOver(v === true)}
            />
            <Label htmlFor="edit-lt-carryover" className="font-normal">
              Unused days carry over to next year
            </Label>
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
