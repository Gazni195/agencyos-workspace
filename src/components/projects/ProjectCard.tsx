import { Link } from "@tanstack/react-router";
import { CalendarDays, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { DeliveryProject } from "@/data/delivery";
import { money } from "@/data/agency";

export function ProjectCard({
  project,
  view = "grid",
}: {
  project: DeliveryProject;
  view?: "grid" | "list";
}) {
  if (view === "list") {
    return (
      <Link
        to="/projects/$projectId"
        params={{ projectId: project.id }}
        className="surface-card flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-accent/40"
      >
        <div className="min-w-40 flex-1">
          <p className="font-semibold text-foreground">{project.name}</p>
          <p className="text-xs text-muted-foreground">{project.client}</p>
        </div>
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{project.leadInitials}</AvatarFallback>
        </Avatar>
        <div className="w-32">
          <Progress value={project.progress} className="h-2" />
        </div>
        <span className="w-20 text-sm text-muted-foreground">{project.progress}%</span>
        <span className="w-24 text-sm font-medium text-foreground">{money(project.budget)}</span>
        <span className="w-28 text-sm text-muted-foreground">{project.due}</span>
        <StatusBadge status={project.status} />
      </Link>
    );
  }

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="surface-card flex flex-col gap-3 p-5 transition-colors hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{project.name}</p>
          <p className="text-xs text-muted-foreground">{project.client}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <DollarSign className="size-3.5" /> {money(project.budget)}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" /> {project.due}
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-border pt-3">
        <Avatar className="size-7">
          <AvatarFallback className="text-[11px]">{project.leadInitials}</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium text-foreground">{project.lead}</span>
      </div>
    </Link>
  );
}
