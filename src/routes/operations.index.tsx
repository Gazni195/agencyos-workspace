import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, Eye } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useTasksStore } from "@/store/tasksStore";
import { useProjectsStore } from "@/store/projectsStore";
import { type DeliveryTask } from "@/data/delivery";

export const Route = createFileRoute("/operations/")({
  head: () => ({
    meta: [
      { title: "Operations Overview — AgencyOS" },
      {
        name: "description",
        content: "Pending, in-review, completed and delayed work at a glance.",
      },
    ],
  }),
  component: OperationsOverviewPage,
});

const isOverdue = (task: DeliveryTask) =>
  task.status !== "done" && new Date(task.due) < new Date(new Date().toDateString());

function OperationsOverviewPage() {
  const tasks = useTasksStore((s) => s.tasks);
  const projects = useProjectsStore((s) => s.projects);
  const projectById = (id: string) => projects.find((p) => p.id === id);

  const pendingCount = tasks.filter(
    (t) => t.status === "todo" || t.status === "in-progress",
  ).length;
  const reviewCount = tasks.filter((t) => t.status === "review").length;
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const overdueTasks = useMemo(() => tasks.filter(isOverdue), [tasks]);
  const delayedProjects = projects.filter((p) => p.status === "delayed");

  const projectHealth = useMemo(
    () => [
      {
        status: "on-track" as const,
        count: projects.filter((p) => p.status === "on-track").length,
      },
      { status: "at-risk" as const, count: projects.filter((p) => p.status === "at-risk").length },
      { status: "delayed" as const, count: projects.filter((p) => p.status === "delayed").length },
      {
        status: "completed" as const,
        count: projects.filter((p) => p.status === "completed").length,
      },
    ],
    [projects],
  );

  const overdueColumns: Column<DeliveryTask>[] = [
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
      render: (t) => {
        const project = projectById(t.projectId);
        return project ? (
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            {project.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      key: "due",
      header: "Due",
      sortValue: (t) => t.due,
      render: (t) => <span className="text-destructive">{t.due}</span>,
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
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Pending tasks" value={String(pendingCount)} icon={Clock} />
        <KpiCard label="Awaiting review" value={String(reviewCount)} icon={Eye} />
        <KpiCard label="Completed" value={String(completedCount)} icon={CheckCircle2} />
        <KpiCard
          label="Delayed / overdue"
          value={String(overdueTasks.length + delayedProjects.length)}
          hint={`${delayedProjects.length} projects · ${overdueTasks.length} tasks`}
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Project health</p>
          <ul className="space-y-3">
            {projectHealth.map((row) => (
              <li key={row.status} className="flex items-center justify-between text-sm">
                <StatusBadge status={row.status} />
                <span className="font-semibold">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-1 font-semibold">Delayed & overdue work</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Tasks past their due date and not yet done.
          </p>
          <DataTable
            columns={overdueColumns}
            rows={overdueTasks}
            rowKey={(t) => t.id}
            pageSize={5}
            emptyTitle="Nothing overdue"
            emptyDescription="Every open task is on schedule."
          />
        </div>
      </div>
    </div>
  );
}
