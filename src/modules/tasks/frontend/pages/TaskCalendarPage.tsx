import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "@/shared/frontend/components/SearchBar";
import { FilterBar } from "@/shared/frontend/components/FilterBar";
import { Button } from "@/shared/frontend/components/ui/button";
import { NewTaskDialog } from "@/modules/tasks/frontend/components/NewTaskDialog";
import { TaskDetailDrawer } from "@/modules/tasks/frontend/components/TaskDetailDrawer";
import { useTaskFilters } from "@/modules/tasks/frontend/hooks/useTaskFilters";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";
import { cn } from "@/shared/frontend/utils/utils";

export const priorityDot: Record<string, string> = {
  urgent: "bg-destructive",
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground",
};

export function TaskCalendarPage() {
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.addTask);
  const { query, setQuery, filters, filtered, reset } = useTaskFilters(tasks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tasks.find((t) => t.id === selectedId) ?? null;
  const [month, setMonth] = useState(() => new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const day of days) map.set(format(day, "yyyy-MM-dd"), []);
    for (const task of filtered) {
      const key = task.due;
      if (map.has(key)) map.get(key)!.push(task);
    }
    return map;
  }, [days, filtered]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search tasks…"
          className="max-w-sm"
        />
        <FilterBar filters={filters} onReset={reset} />
        <div className="ml-auto">
          <NewTaskDialog onCreate={addTask} />
        </div>
      </div>

      <div className="surface-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">{format(month, "MMMM yyyy")}</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Previous month"
              onClick={() => setMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Next month"
              onClick={() => setMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-border text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="bg-muted/50 px-2 py-1.5 text-center font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayTasks = tasksByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, month);
            return (
              <div
                key={key}
                className={cn(
                  "min-h-24 bg-card p-1.5",
                  !inMonth && "bg-muted/20 text-muted-foreground",
                )}
              >
                <p
                  className={cn(
                    "mb-1 inline-flex size-5 items-center justify-center rounded-full text-[11px]",
                    isToday(day) && "bg-primary font-semibold text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </p>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setSelectedId(task.id)}
                      className="flex w-full items-center gap-1.5 truncate rounded-md bg-muted/60 px-1.5 py-1 text-left text-[11px] font-medium hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          priorityDot[task.priority] ?? "bg-muted-foreground",
                        )}
                      />
                      <span className="truncate">{task.title}</span>
                    </button>
                  ))}
                  {dayTasks.length > 3 && (
                    <p className="px-1.5 text-[11px] text-muted-foreground">
                      +{dayTasks.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskDetailDrawer
        task={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
