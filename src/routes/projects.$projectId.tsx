import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { projectById } from "@/data/delivery";
import { money } from "@/data/agency";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Details — AgencyOS" },
      { name: "description", content: "Review project progress, budget, milestones and delivery health." },
      { property: "og:title", content: "Project Details — AgencyOS" },
      { property: "og:description", content: "Review project progress, budget, milestones and delivery health." },
    ],
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const project = projectById(projectId);

  if (!project) {
    return <EmptyProject />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <Link to="/projects" className="mb-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft className="size-4" /> Back to projects</Link>
      <PageHeader title={project.name} description={`${project.client} · Led by ${project.lead}`} actions={<StatusBadge status={project.status} />} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-4"><p className="font-semibold">Delivery progress</p><span className="text-sm font-semibold">{project.progress}%</span></div>
          <Progress value={project.progress} className="mt-4 h-3" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>
        <div className="surface-card space-y-5 p-5">
          <Metric icon={<DollarSign className="size-4" />} label="Budget" value={money(project.budget)} />
          <Metric icon={<DollarSign className="size-4" />} label="Spent" value={money(project.spend)} />
          <Metric icon={<CalendarDays className="size-4" />} label="Due" value={project.due} />
        </div>
      </div>
    </section>
  );
}

function EmptyProject() {
  return <section className="mx-auto max-w-7xl"><Link to="/projects" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft className="size-4" /> Back to projects</Link><h1 className="mt-8 text-2xl font-bold">Project not found</h1></section>;
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3"><span className="text-primary">{icon}</span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div></div>;
}