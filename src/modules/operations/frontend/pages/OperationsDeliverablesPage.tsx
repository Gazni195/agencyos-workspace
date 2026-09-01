import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { Button } from "@/shared/frontend/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { useDeliverablesStore } from "@/modules/projects/frontend/store/deliverablesStore";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import { type Deliverable } from "@/modules/projects/types";

export function OperationsDeliverablesPage() {
  const deliverables = useDeliverablesStore((s) => s.deliverables);
  const setStatus = useDeliverablesStore((s) => s.setStatus);
  const employees = useEmployeesStore((s) => s.employees);
  const projects = useProjectsStore((s) => s.projects);
  const clients = useClientsStore((s) => s.clients);
  const projectById = (id: string) => projects.find((p) => p.id === id);
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? "Unknown client";

  const queue = useMemo(
    () =>
      deliverables.filter((d) => d.status === "internal-review" || d.status === "client-review"),
    [deliverables],
  );

  const columns: Column<Deliverable>[] = [
    {
      key: "title",
      header: "Deliverable",
      sortValue: (d) => d.title,
      render: (d) => (
        <div>
          <p className="font-medium">{d.title}</p>
          <p className="text-xs text-muted-foreground">{d.type}</p>
        </div>
      ),
    },
    {
      key: "project",
      header: "Project / Client",
      sortValue: (d) => projectById(d.projectId)?.name ?? "",
      render: (d) => {
        const project = projectById(d.projectId);
        return (
          <div>
            {project ? (
              <Link
                to="/projects/$projectId"
                params={{ projectId: project.id }}
                className="text-sm hover:underline"
              >
                {project.name}
              </Link>
            ) : (
              <p className="text-sm">—</p>
            )}
            <p className="text-xs text-muted-foreground">
              {project ? clientName(project.clientId) : "—"}
            </p>
          </div>
        );
      },
    },
    {
      key: "assignee",
      header: "Submitted by",
      sortValue: (d) => employees.find((e) => e.id === d.assigneeId)?.name ?? "",
      render: (d) => {
        const a = employees.find((e) => e.id === d.assigneeId);
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
      key: "due",
      header: "Due",
      sortValue: (d) => d.dueDate,
      render: (d) => <span className="text-muted-foreground">{d.dueDate}</span>,
    },
    {
      key: "status",
      header: "Stage",
      sortValue: (d) => d.status,
      render: (d) => <StatusBadge status={d.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (d) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="icon"
            className="size-7 text-success hover:bg-success/12 hover:text-success"
            aria-label={`Approve ${d.title}`}
            onClick={() => {
              setStatus(d.id, "approved");
              toast.success(`Approved "${d.title}"`);
            }}
          >
            <Check className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
            aria-label={`Request changes on ${d.title}`}
            onClick={() => {
              setStatus(d.id, "changes-requested");
              toast.error(`Sent "${d.title}" back for changes`);
            }}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={queue}
      rowKey={(d) => d.id}
      pageSize={10}
      emptyTitle="Nothing awaiting review"
      emptyDescription="Deliverables sent for internal or client review will show up here for approval."
    />
  );
}
