import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox — AgencyOS" }, { name: "description", content: "Keep up with agency conversations in AgencyOS." }, { property: "og:title", content: "Inbox — AgencyOS" }, { property: "og:description", content: "Keep up with agency conversations in AgencyOS." }] }),
  component: InboxPage,
});

function InboxPage() {
  return <ModulePage title="Inbox" description="Your communications workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}