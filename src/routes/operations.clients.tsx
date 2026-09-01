import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";
import { useDeliverablesStore } from "@/modules/projects/frontend/store/deliverablesStore";
import type { Client } from "@/modules/clients/types";

export const Route = createFileRoute("/operations/clients")({
  head: () => ({
    meta: [
      { title: "Clients Waiting — AgencyOS" },
      {
        name: "description",
        content: "Which clients have delayed work or deliverables awaiting review.",
      },
    ],
  }),
  component: OperationsClientsPage,
});

const isOverdue = (due: string) => new Date(due) < new Date(new Date().toDateString());

type ClientRow = {
  client: Client;
  activeProjects: number;
  delayedProjects: number;
  pendingDeliverables: number;
  overdueTasks: number;
};

function OperationsClientsPage() {
  const clients = useClientsStore((s) => s.clients);
  const projects = useProjectsStore((s) => s.projects);
  const tasks = useTasksStore((s) => s.tasks);
  const deliverables = useDeliverablesStore((s) => s.deliverables);

  const rows = useMemo<ClientRow[]>(
    () =>
      clients
        .map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const projectIds = new Set(clientProjects.map((p) => p.id));
          const clientTasks = tasks.filter((t) => projectIds.has(t.projectId));
          const clientDeliverables = deliverables.filter((d) => projectIds.has(d.projectId));
          return {
            client,
            activeProjects: clientProjects.filter((p) => p.status !== "completed").length,
            delayedProjects: clientProjects.filter((p) => p.status === "delayed").length,
            pendingDeliverables: clientDeliverables.filter(
              (d) => d.status === "internal-review" || d.status === "client-review",
            ).length,
            overdueTasks: clientTasks.filter((t) => t.status !== "done" && isOverdue(t.due)).length,
          };
        })
        .sort(
          (a, b) =>
            b.delayedProjects +
            b.pendingDeliverables +
            b.overdueTasks -
            (a.delayedProjects + a.pendingDeliverables + a.overdueTasks),
        ),
    [clients, projects, tasks, deliverables],
  );

  const columns: Column<ClientRow>[] = [
    {
      key: "client",
      header: "Client",
      sortValue: (r) => r.client.name,
      render: (r) => (
        <Link
          to="/clients/$clientId"
          params={{ clientId: r.client.id }}
          className="font-medium hover:underline"
        >
          {r.client.name}
        </Link>
      ),
    },
    {
      key: "activeProjects",
      header: "Active projects",
      align: "right",
      sortValue: (r) => r.activeProjects,
      render: (r) => r.activeProjects,
    },
    {
      key: "delayedProjects",
      header: "Delayed",
      align: "right",
      sortValue: (r) => r.delayedProjects,
      render: (r) =>
        r.delayedProjects > 0 ? (
          <span className="font-semibold text-destructive">{r.delayedProjects}</span>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
    {
      key: "pendingDeliverables",
      header: "Deliverables pending",
      align: "right",
      sortValue: (r) => r.pendingDeliverables,
      render: (r) => r.pendingDeliverables,
    },
    {
      key: "overdueTasks",
      header: "Overdue tasks",
      align: "right",
      sortValue: (r) => r.overdueTasks,
      render: (r) =>
        r.overdueTasks > 0 ? (
          <span className="font-semibold text-destructive">{r.overdueTasks}</span>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) =>
        r.delayedProjects + r.overdueTasks > 0 ? (
          <StatusBadge status="delayed" />
        ) : r.pendingDeliverables > 0 ? (
          <StatusBadge status="review" />
        ) : (
          <StatusBadge status="on-track" />
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.client.id}
      pageSize={10}
      emptyTitle="No clients yet"
      emptyDescription="Add clients in the Clients module to see their delivery status here."
    />
  );
}
