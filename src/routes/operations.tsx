import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [
      { title: "Operations — AgencyOS" },
      {
        name: "description",
        content: "Live visibility into pending work, team workload, and client deliverables.",
      },
      { property: "og:title", content: "Operations — AgencyOS" },
      {
        property: "og:description",
        content: "Live visibility into pending work, team workload, and client deliverables.",
      },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Operations">
      <OperationsLayout />
    </RequireModuleAccess>
  ),
});

const tabs = [
  { label: "Overview", to: "/operations" },
  { label: "Workload", to: "/operations/workload" },
  { label: "Clients", to: "/operations/clients" },
  { label: "Deliverables", to: "/operations/deliverables" },
] as const;

function OperationsLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Operations"
        description="What's pending, who's working on it, and what clients are waiting for."
      />
      <nav
        aria-label="Operations sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/operations" }}
            className="shrink-0 rounded-t-lg border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{
              className: cn(
                "shrink-0 rounded-t-lg border-b-2 border-primary px-3.5 py-2.5 text-sm font-semibold text-foreground",
              ),
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </section>
  );
}
