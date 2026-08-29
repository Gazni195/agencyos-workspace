import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — AgencyOS" }, { name: "description", content: "Track and manage agency leads in AgencyOS." }, { property: "og:title", content: "Leads — AgencyOS" }, { property: "og:description", content: "Track and manage agency leads in AgencyOS." }] }),
  component: LeadsPage,
});

function LeadsPage() {
  return <ModulePage title="Leads" description="Your lead pipeline is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}