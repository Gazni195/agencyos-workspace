import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Send } from "lucide-react";
import { DrawerPanel } from "@/shared/frontend/components/DrawerPanel";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { Checkbox } from "@/shared/frontend/components/ui/checkbox";
import { Input } from "@/shared/frontend/components/ui/input";
import { Textarea } from "@/shared/frontend/components/ui/textarea";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/frontend/components/ui/select";
import {
  taskStatuses,
  taskStatusLabels,
  type DeliveryTask,
  type TaskPriority,
  type TaskStatus,
} from "@/modules/tasks/types";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";

const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

export function TaskDetailDrawer({
  task,
  open,
  onOpenChange,
}: {
  task: DeliveryTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateTask = useTasksStore((s) => s.updateTask);
  const toggleChecklistItem = useTasksStore((s) => s.toggleChecklistItem);
  const addChecklistItem = useTasksStore((s) => s.addChecklistItem);
  const addComment = useTasksStore((s) => s.addComment);
  const employees = useEmployeesStore((s) => s.employees);
  const projects = useProjectsStore((s) => s.projects);

  const [newChecklistLabel, setNewChecklistLabel] = useState("");
  const [newComment, setNewComment] = useState("");

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = employees.find((e) => e.id === task.assigneeId);

  return (
    <DrawerPanel
      open={open}
      onOpenChange={onOpenChange}
      title={task.title}
      description={project?.name}
    >
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground">{task.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <Select
              value={task.status}
              onValueChange={(v) => updateTask(task.id, { status: v as TaskStatus })}
            >
              <SelectTrigger className="h-9" aria-label="Status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {taskStatusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Priority</p>
            <Select
              value={task.priority}
              onValueChange={(v) => updateTask(task.id, { priority: v as TaskPriority })}
            >
              <SelectTrigger className="h-9" aria-label="Priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Assignee</p>
            <Select
              value={task.assigneeId}
              onValueChange={(v) => updateTask(task.id, { assigneeId: v })}
            >
              <SelectTrigger className="h-9" aria-label="Assignee">
                <SelectValue />
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
            <p className="text-xs font-medium text-muted-foreground">Due date</p>
            <Input
              type="date"
              className="h-9"
              value={task.due}
              onChange={(e) => updateTask(task.id, { due: e.target.value })}
              aria-label="Due date"
            />
          </div>
        </div>

        {project && (
          <p className="text-sm">
            Project:{" "}
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="font-medium text-primary hover:underline"
            >
              {project.name}
            </Link>
          </p>
        )}

        {assignee && (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{assignee.name}</span>
            <span className="text-xs text-muted-foreground">{assignee.role}</span>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-semibold">
            Checklist{" "}
            {task.checklist.length > 0 && (
              <span className="font-normal text-muted-foreground">
                ({task.checklist.filter((c) => c.done).length}/{task.checklist.length})
              </span>
            )}
          </p>
          <ul className="space-y-2">
            {task.checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <Checkbox
                  checked={item.done}
                  onCheckedChange={() => toggleChecklistItem(task.id, item.id)}
                  id={`cl-${item.id}`}
                />
                <label
                  htmlFor={`cl-${item.id}`}
                  className={item.done ? "text-sm text-muted-foreground line-through" : "text-sm"}
                >
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
          <form
            className="mt-2 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newChecklistLabel.trim()) return;
              addChecklistItem(task.id, {
                id: `cl-${task.id}-${Date.now()}`,
                label: newChecklistLabel.trim(),
                done: false,
              });
              setNewChecklistLabel("");
            }}
          >
            <Input
              value={newChecklistLabel}
              onChange={(e) => setNewChecklistLabel(e.target.value)}
              placeholder="Add checklist item…"
              className="h-8"
            />
            <Button
              type="submit"
              size="icon"
              variant="outline"
              className="size-8 shrink-0"
              aria-label="Add checklist item"
            >
              <Plus className="size-3.5" />
            </Button>
          </form>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Comments</p>
          <ul className="space-y-3">
            {task.comments.map((c) => (
              <li key={c.id} className="rounded-lg bg-muted/50 p-2.5 text-sm">
                <p className="font-medium">{c.author}</p>
                <p className="mt-0.5 text-muted-foreground">{c.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.when}</p>
              </li>
            ))}
          </ul>
          <form
            className="mt-2 flex items-start gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              addComment(task.id, {
                id: `cm-${task.id}-${Date.now()}`,
                author: assignee?.name ?? "You",
                text: newComment.trim(),
                when: "Just now",
              });
              setNewComment("");
              toast.success("Comment added");
            }}
          >
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment…"
              className="min-h-[44px]"
            />
            <Button type="submit" size="icon" className="shrink-0" aria-label="Add comment">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </DrawerPanel>
  );
}
