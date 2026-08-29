import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [{ title: "Employees — AgencyOS" }, { name: "description", content: "Manage your agency team in AgencyOS." }, { property: "og:title", content: "Employees — AgencyOS" }, { property: "og:description", content: "Manage your agency team in AgencyOS." }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  return <ModulePage title="Employees" description="Your employee workspace is ready for the next build phase." />;
}

function ModulePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-6xl"><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></section>;
}