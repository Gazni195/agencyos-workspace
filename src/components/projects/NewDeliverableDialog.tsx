import { useMemo, useState } from "react";
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
import type { Deliverable } from "@/data/delivery";
import { useEmployeesStore } from "@/store/employeesStore";
import { useTasksStore } from "@/store/tasksStore";

const NONE = "none";

export function NewDeliverableDialog({
  projectId,
  onCreate,
}: {
  projectId: string;
  onCreate: (deliverable: Deliverable) => void;
}) {
  const employees = useEmployeesStore((s) => s.employees);
  const allTasks = useTasksStore((s) => s.tasks);
  const projectTasks = useMemo(
    () => allTasks.filter((t) => t.projectId === projectId),
    [allTasks, projectId],
  );

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [taskId, setTaskId] = useState(NONE);
  const [dueDate, setDueDate] = useState("");

  const reset = () => {
    setTitle("");
    setType("");
    setAssigneeId("");
    setTaskId(NONE);
    setDueDate("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !type.trim() || !assigneeId || !dueDate) {
      toast.error("Title, type, assignee and due date are required.");
      return;
    }
    const deliverable: Deliverable = {
      id: `dl-${Date.now()}`,
      projectId,
      title: title.trim(),
      type: type.trim(),
      assigneeId,
      status: "in-progress",
      dueDate,
      ...(taskId !== NONE ? { taskId } : {}),
    };
    onCreate(deliverable);
    toast.success(`${deliverable.title} added`);
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
          <Plus className="size-4" /> New deliverable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New deliverable</DialogTitle>
          <DialogDescription>
            Track a client-facing output for this project through review and approval.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="dl-title">Title</Label>
            <Input
              id="dl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Final promo video cut"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dl-type">Type</Label>
            <Input
              id="dl-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. Video Edit, Photo Set, Design Asset"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dl-due">Due date</Label>
              <Input
                id="dl-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Linked task (optional)</Label>
            <Select value={taskId} onValueChange={setTaskId}>
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>None</SelectItem>
                {projectTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create deliverable</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
