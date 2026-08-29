import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients — AgencyOS" },
      { name: "description", content: "Manage AgencyOS client relationships and accounts." },
      { property: "og:title", content: "Clients — AgencyOS" },
      { property: "og:description", content: "Manage AgencyOS client relationships and accounts." },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return <ModulePage title="Clients" description="Your client workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}