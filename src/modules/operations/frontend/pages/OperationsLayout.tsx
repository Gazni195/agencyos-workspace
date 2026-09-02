import { Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { cn } from "@/shared/frontend/utils/utils";

export const tabs = [
  { label: "Overview", to: "/operations" },
  { label: "Workload", to: "/operations/workload" },
  { label: "Clients", to: "/operations/clients" },
  { label: "Deliverables", to: "/operations/deliverables" },
] as const;

export function OperationsLayout() {
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
