import { useState } from "react";
import { TaskCard } from "./TaskCard";
import {
  taskStatuses,
  taskStatusLabels,
  type DeliveryTask,
  type TaskStatus,
} from "@/data/delivery";
import { useTasksStore } from "@/store/tasksStore";
import { cn } from "@/lib/utils";

export function TaskBoard({
  tasks,
  onOpen,
}: {
  tasks: DeliveryTask[];
  onOpen: (task: DeliveryTask) => void;
}) {
  const setStatus = useTasksStore((s) => s.setStatus);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {taskStatuses.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStatus(status);
            }}
            onDragLeave={() => setOverStatus((s) => (s === status ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              if (draggingId) setStatus(draggingId, status);
              setDraggingId(null);
              setOverStatus(null);
            }}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-muted/30 p-3 transition-colors",
              overStatus === status && "border-primary/50 bg-primary-soft/40",
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-sm font-semibold">{taskStatusLabels[status]}</p>
              <span className="text-xs text-muted-foreground">{columnTasks.length}</span>
            </div>
            <div className="flex-1 space-y-2">
              {columnTasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  No tasks
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onOpen={onOpen}
                    dragging={draggingId === task.id}
                    onDragStart={() => setDraggingId(task.id)}
                    onDragEnd={() => setDraggingId(null)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
