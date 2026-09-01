import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/shared/frontend/components/SearchBar";
import { FilterBar } from "@/shared/frontend/components/FilterBar";
import { TaskBoard } from "@/modules/tasks/frontend/components/TaskBoard";
import { TaskDetailDrawer } from "@/modules/tasks/frontend/components/TaskDetailDrawer";
import { NewTaskDialog } from "@/modules/tasks/frontend/components/NewTaskDialog";
import { useTaskFilters } from "@/modules/tasks/frontend/hooks/useTaskFilters";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";

export const Route = createFileRoute("/tasks/board")({
  head: () => ({
    meta: [
      { title: "Task Board — AgencyOS" },
      { name: "description", content: "Drag tasks across statuses on the AgencyOS task board." },
    ],
  }),
  component: TaskBoardPage,
});

function TaskBoardPage() {
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.addTask);
  const { query, setQuery, filters, filtered, reset } = useTaskFilters(tasks);
  // Hold only the id, and re-derive the live task on every render — holding
  // the task object itself would freeze the drawer on a stale snapshot as
  // soon as a checklist/status/comment edit updates the store.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

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

      <TaskBoard tasks={filtered} onOpen={(t) => setSelectedId(t.id)} />

      <TaskDetailDrawer
        task={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
