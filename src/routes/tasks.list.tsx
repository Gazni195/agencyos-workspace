import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchBar } from "@/shared/frontend/components/SearchBar";
import { FilterBar } from "@/shared/frontend/components/FilterBar";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { NewTaskDialog } from "@/modules/tasks/frontend/components/NewTaskDialog";
import { TaskDetailDrawer } from "@/modules/tasks/frontend/components/TaskDetailDrawer";
import { useTaskFilters } from "@/modules/tasks/frontend/hooks/useTaskFilters";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";
import { type DeliveryTask } from "@/modules/tasks/types";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";

export const Route = createFileRoute("/tasks/list")({
  head: () => ({
    meta: [
      { title: "Task List — AgencyOS" },
      { name: "description", content: "Browse and filter every AgencyOS task in a sortable list." },
    ],
  }),
  component: TaskListPage,
});

function TaskListPage() {
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.addTask);
  const employees = useEmployeesStore((s) => s.employees);
  const projects = useProjectsStore((s) => s.projects);
  const projectById = (id: string) => projects.find((p) => p.id === id);
  const { query, setQuery, filters, filtered, reset } = useTaskFilters(tasks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  const columns: Column<DeliveryTask>[] = [
    {
      key: "title",
      header: "Task",
      sortValue: (t) => t.title,
      render: (t) => <span className="font-medium">{t.title}</span>,
    },
    {
      key: "project",
      header: "Project",
      sortValue: (t) => projectById(t.projectId)?.name ?? "",
      render: (t) => (
        <span className="text-muted-foreground">{projectById(t.projectId)?.name ?? "—"}</span>
      ),
    },
    {
      key: "assignee",
      header: "Assignee",
      sortValue: (t) => employees.find((e) => e.id === t.assigneeId)?.name ?? "",
      render: (t) => {
        const a = employees.find((e) => e.id === t.assigneeId);
        return a ? (
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px]">{a.initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{a.name}</span>
          </div>
        ) : (
          "—"
        );
      },
    },
    {
      key: "priority",
      header: "Priority",
      sortValue: (t) => t.priority,
      render: (t) => <StatusBadge status={t.priority} />,
    },
    {
      key: "due",
      header: "Due",
      sortValue: (t) => t.due,
      render: (t) => <span className="text-muted-foreground">{t.due}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (t) => t.status,
      render: (t) => <StatusBadge status={t.status} />,
    },
  ];

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

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(t) => t.id}
        onRowClick={(t) => setSelectedId(t.id)}
        pageSize={10}
        emptyTitle="No tasks match your filters"
        emptyDescription="Try a different search term or reset your filters."
      />

      <TaskDetailDrawer
        task={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
