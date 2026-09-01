import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/frontend/components/ui/select";
import type { Department, Designation } from "@/modules/settings/types";

export function NewDepartmentDialog({ onCreate }: { onCreate: (d: Department) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [head, setHead] = useState("");

  const reset = () => {
    setName("");
    setHead("");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Department name is required.");
      return;
    }
    onCreate({ id: `dept-${Date.now()}`, name: name.trim(), head: head.trim() || "Unassigned" });
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
          <Plus className="size-4" /> Add department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add department</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="dept-name">Name</Label>
            <Input
              id="dept-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creative"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dept-head">Department head</Label>
            <Input
              id="dept-head"
              value={head}
              onChange={(e) => setHead(e.target.value)}
              placeholder="e.g. Jordan Wells"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add department</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
  onSave,
  trigger,
}: {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: Partial<Department>) => void;
  trigger?: ReactNode;
}) {
  const [name, setName] = useState(department.name);
  const [head, setHead] = useState(department.head);

  useEffect(() => {
    if (open) {
      setName(department.name);
      setHead(department.head);
    }
  }, [open, department]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Department name is required.");
      return;
    }
    onSave({ name: name.trim(), head: head.trim() || "Unassigned" });
    toast.success("Department updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit department</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="edit-dept-name">Name</Label>
            <Input id="edit-dept-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-dept-head">Department head</Label>
            <Input id="edit-dept-head" value={head} onChange={(e) => setHead(e.target.value)} />
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

export function NewDesignationDialog({
  departments,
  onCreate,
}: {
  departments: Department[];
  onCreate: (d: Designation) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");

  const reset = () => {
    setTitle("");
    setDepartment("");
    setLevel("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !department || !level.trim()) {
      toast.error("Title, department and level are required.");
      return;
    }
    onCreate({ id: `desig-${Date.now()}`, title: title.trim(), department, level: level.trim() });
    toast.success(`${title.trim()} added`);
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
          <Plus className="size-4" /> Add designation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add designation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="desig-title">Title</Label>
            <Input
              id="desig-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Brand Designer"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="desig-level">Level</Label>
            <Input
              id="desig-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g. Junior, Mid, Senior, Lead"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add designation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditDesignationDialog({
  designation,
  departments,
  open,
  onOpenChange,
  onSave,
}: {
  designation: Designation;
  departments: Department[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: Partial<Designation>) => void;
}) {
  const [title, setTitle] = useState(designation.title);
  const [department, setDepartment] = useState(designation.department);
  const [level, setLevel] = useState(designation.level);

  useEffect(() => {
    if (open) {
      setTitle(designation.title);
      setDepartment(designation.department);
      setLevel(designation.level);
    }
  }, [open, designation]);

  const handleSubmit = () => {
    if (!title.trim() || !department || !level.trim()) {
      toast.error("Title, department and level are required.");
      return;
    }
    onSave({ title: title.trim(), department, level: level.trim() });
    toast.success("Designation updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit designation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="edit-desig-title">Title</Label>
            <Input id="edit-desig-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-desig-level">Level</Label>
            <Input id="edit-desig-level" value={level} onChange={(e) => setLevel(e.target.value)} />
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

export function EditIconButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      aria-label="Edit"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Pencil className="size-3.5" />
    </Button>
  );
}
