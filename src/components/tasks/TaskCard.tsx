import { CalendarDays, ListChecks, MoveRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  taskStatuses,
  taskStatusLabels,
  type DeliveryTask,
  type TaskStatus,
} from "@/data/delivery";
import { useEmployeesStore } from "@/store/employeesStore";
import { useTasksStore } from "@/store/tasksStore";
import { useProjectsStore } from "@/store/projectsStore";
import { cn } from "@/lib/utils";

const isOverdue = (due: string) => new Date(due) < new Date(new Date().toDateString());

export function TaskCard({
  task,
  onOpen,
  dragging = false,
  onDragStart,
  onDragEnd,
}: {
  task: DeliveryTask;
  onOpen: (task: DeliveryTask) => void;
  dragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}) {
  const setStatus = useTasksStore((s) => s.setStatus);
  const employees = useEmployeesStore((s) => s.employees);
  const assignee = employees.find((e) => e.id === task.assigneeId);
  const projects = useProjectsStore((s) => s.projects);
  const project = projects.find((p) => p.id === task.projectId);
  const doneCount = task.checklist.filter((c) => c.done).length;
  const overdue = task.status !== "done" && isOverdue(task.due);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "surface-card cursor-grab space-y-2.5 p-3 active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="min-w-0 text-left text-sm font-semibold hover:text-primary"
        >
          {task.title}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              aria-label={`Move ${task.title}`}
            >
              <MoveRight className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {taskStatuses
              .filter((s) => s !== task.status)
              .map((s: TaskStatus) => (
                <DropdownMenuItem key={s} onSelect={() => setStatus(task.id, s)}>
                  Move to {taskStatusLabels[s]}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project && <p className="truncate text-xs text-muted-foreground">{project.name}</p>}

      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={task.priority} />
        {task.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className={cn("flex items-center gap-1", overdue && "font-medium text-destructive")}>
          <CalendarDays className="size-3.5" /> {task.due}
        </span>
        {task.checklist.length > 0 && (
          <span className="flex items-center gap-1">
            <ListChecks className="size-3.5" />
            {doneCount}/{task.checklist.length}
          </span>
        )}
      </div>

      {assignee && (
        <div className="flex items-center gap-2 border-t border-border pt-2">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">{assignee.initials}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs font-medium">{assignee.name}</span>
        </div>
      )}
    </div>
  );
}
