import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AgencyOS" }, { name: "description", content: "Configure your AgencyOS workspace settings." }, { property: "og:title", content: "Settings — AgencyOS" }, { property: "og:description", content: "Configure your AgencyOS workspace settings." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return <ModulePage title="Settings" description="Your workspace settings are ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}