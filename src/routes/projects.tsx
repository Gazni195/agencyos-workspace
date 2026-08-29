import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — AgencyOS" }, { name: "description", content: "Plan and manage agency projects in AgencyOS." }, { property: "og:title", content: "Projects — AgencyOS" }, { property: "og:description", content: "Plan and manage agency projects in AgencyOS." }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return <ModulePage title="Projects" description="Your project workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}