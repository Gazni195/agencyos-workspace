import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — AgencyOS" }, { name: "description", content: "Review agency performance reports in AgencyOS." }, { property: "og:title", content: "Reports — AgencyOS" }, { property: "og:description", content: "Review agency performance reports in AgencyOS." }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return <ModulePage title="Reports" description="Your reporting workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}