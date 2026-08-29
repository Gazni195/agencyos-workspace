import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — AgencyOS" }, { name: "description", content: "Organize and track agency tasks in AgencyOS." }, { property: "og:title", content: "Tasks — AgencyOS" }, { property: "og:description", content: "Organize and track agency tasks in AgencyOS." }] }),
  component: TasksPage,
});

function TasksPage() {
  return <ModulePage title="Tasks" description="Your task workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}