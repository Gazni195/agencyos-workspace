import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/frontend/components/ui/card";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { Link } from "@tanstack/react-router";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import { CalendarClock } from "lucide-react";

export function UpcomingDeadlines() {
  const deliveryProjects = useProjectsStore((s) => s.projects);
  const deliveryTasks = useTasksStore((s) => s.tasks);
  const clients = useClientsStore((s) => s.clients);
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? "Unknown client";
  const items = [
    ...deliveryProjects.map((p) => ({
      id: p.id,
      title: p.name,
      sub: clientName(p.clientId),
      due: p.due,
      status: p.status,
      to: "/projects" as const,
    })),
    ...deliveryTasks.map((t) => ({
      id: t.id,
      title: t.title,
      sub: t.projectId,
      due: t.due,
      status: t.status,
      to: "/tasks" as const,
    })),
  ].sort((a, b) => a.due.localeCompare(b.due));

  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Upcoming deadlines</CardTitle>
          <CardDescription>Projects and tasks due soon</CardDescription>
        </div>
        <CalendarClock className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        {items.slice(0, 7).map((item) => (
          <Link
            key={`${item.to}-${item.id}`}
            to={item.to}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.sub}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {new Date(item.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <StatusBadge status={item.status} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
