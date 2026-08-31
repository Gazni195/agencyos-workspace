import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Info, X } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskDetailDrawer } from "@/components/tasks/TaskDetailDrawer";
import { useTasksStore } from "@/store/tasksStore";
import { type DeliveryTask } from "@/data/delivery";
import { useEmployeesStore } from "@/store/employeesStore";
import { useProjectsStore } from "@/store/projectsStore";

export const Route = createFileRoute("/operations/deliverables")({
  head: () => ({
    meta: [
      { title: "Deliverables — AgencyOS" },
      {
        name: "description",
        content: "Work awaiting internal review before it goes to the client.",
      },
    ],
  }),
  component: OperationsDeliverablesPage,
});

function OperationsDeliverablesPage() {
  const tasks = useTasksStore((s) => s.tasks);
  const setStatus = useTasksStore((s) => s.setStatus);
  const employees = useEmployeesStore((s) => s.employees);
  const projects = useProjectsStore((s) => s.projects);
  const projectById = (id: string) => projects.find((p) => p.id === id);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queue = useMemo(() => tasks.filter((t) => t.status === "review"), [tasks]);
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  const columns: Column<DeliveryTask>[] = [
    {
      key: "title",
      header: "Deliverable",
      sortValue: (t) => t.title,
      render: (t) => <span className="font-medium">{t.title}</span>,
    },
    {
      key: "project",
      header: "Project / Client",
      sortValue: (t) => projectById(t.projectId)?.name ?? "",
      render: (t) => {
        const project = projectById(t.projectId);
        return (
          <div>
            <p className="text-sm">{project?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{project?.client}</p>
          </div>
        );
      },
    },
    {
      key: "assignee",
      header: "Submitted by",
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
      key: "due",
      header: "Due",
      sortValue: (t) => t.due,
      render: (t) => <span className="text-muted-foreground">{t.due}</span>,
    },
    {
      key: "priority",
      header: "Priority",
      sortValue: (t) => t.priority,
      render: (t) => <StatusBadge status={t.priority} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="icon"
            className="size-7 text-success hover:bg-success/12 hover:text-success"
            aria-label={`Approve ${t.title}`}
            onClick={() => {
              setStatus(t.id, "done");
              toast.success(`Approved "${t.title}"`);
            }}
          >
            <Check className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
            aria-label={`Request changes on ${t.title}`}
            onClick={() => {
              setStatus(t.id, "in-progress");
              toast.error(`Sent "${t.title}" back for changes`);
            }}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3.5 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          This queue is built from tasks marked "Review". A dedicated deliverable record — linked to
          the specific file, shoot, or output a client approves — is coming in a later phase.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={queue}
        rowKey={(t) => t.id}
        onRowClick={(t) => setSelectedId(t.id)}
        pageSize={10}
        emptyTitle="Nothing awaiting review"
        emptyDescription='Tasks marked "Review" will show up here for approval.'
      />

      <TaskDetailDrawer
        task={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
