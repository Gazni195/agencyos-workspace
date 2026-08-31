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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimesheetEntry } from "@/data/agency";
import { useEmployeesStore } from "@/store/employeesStore";
import { useProjectsStore } from "@/store/projectsStore";
import { useTasksStore } from "@/store/tasksStore";
import { useDeliverablesStore } from "@/store/deliverablesStore";

const NONE = "none";

export function TimesheetFormDialog({ onCreate }: { onCreate: (entry: TimesheetEntry) => void }) {
  const employees = useEmployeesStore((s) => s.employees);
  const projects = useProjectsStore((s) => s.projects);
  const tasks = useTasksStore((s) => s.tasks);
  const deliverables = useDeliverablesStore((s) => s.deliverables);

  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState(NONE);
  const [deliverableId, setDeliverableId] = useState(NONE);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState("");
  const [billable, setBillable] = useState(true);

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === projectId),
    [tasks, projectId],
  );
  const projectDeliverables = useMemo(
    () => deliverables.filter((d) => d.projectId === projectId),
    [deliverables, projectId],
  );

  const reset = () => {
    setEmployeeId("");
    setProjectId("");
    setTaskId(NONE);
    setDeliverableId(NONE);
    setDate(new Date().toISOString().slice(0, 10));
    setHours("");
    setBillable(true);
  };

  const handleSubmit = () => {
    if (!employeeId || !projectId || !date || !hours || Number(hours) <= 0) {
      toast.error("Employee, project, date and hours are required.");
      return;
    }
    const entry: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      employeeId,
      projectId,
      date,
      hours: Number(hours),
      billable,
      status: "submitted",
      ...(taskId !== NONE ? { taskId } : {}),
      ...(deliverableId !== NONE ? { deliverableId } : {}),
    };
    onCreate(entry);
    toast.success("Time logged");
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
        <Button className="gap-1.5">
          <Plus className="size-4" /> Log time
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log time</DialogTitle>
          <DialogDescription>
            Record hours against a project, and optionally the specific task or deliverable they
            went toward.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
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
            <Label>Project</Label>
            <Select
              value={projectId}
              onValueChange={(v) => {
                setProjectId(v);
                setTaskId(NONE);
                setDeliverableId(NONE);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Task (optional)</Label>
              <Select value={taskId} onValueChange={setTaskId} disabled={!projectId}>
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
            <div className="grid gap-1.5">
              <Label>Deliverable (optional)</Label>
              <Select value={deliverableId} onValueChange={setDeliverableId} disabled={!projectId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {projectDeliverables.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ts-date">Date</Label>
              <Input
                id="ts-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ts-hours">Hours</Label>
              <Input
                id="ts-hours"
                type="number"
                min="0"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="4"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="ts-billable"
              checked={billable}
              onCheckedChange={(v) => setBillable(v === true)}
            />
            <Label htmlFor="ts-billable" className="font-normal">
              Billable
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Log time</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
