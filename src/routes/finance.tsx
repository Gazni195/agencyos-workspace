import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Finance — AgencyOS" }, { name: "description", content: "Monitor agency finances and billing in AgencyOS." }, { property: "og:title", content: "Finance — AgencyOS" }, { property: "og:description", content: "Monitor agency finances and billing in AgencyOS." }] }),
  component: FinancePage,
});

function FinancePage() {
  return <ModulePage title="Finance" description="Your finance workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}