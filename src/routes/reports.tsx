import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AgencyOS" },
      { name: "description", content: "Analyze revenue, projects, team and pipeline performance." },
      { property: "og:title", content: "Reports — AgencyOS" },
      {
        property: "og:description",
        content: "Analyze revenue, projects, team and pipeline performance.",
      },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Reports">
      <ReportsLayout />
    </RequireModuleAccess>
  ),
});

const tabs = [
  { label: "Revenue", to: "/reports" },
  { label: "Projects", to: "/reports/projects" },
  { label: "Employees", to: "/reports/employees" },
  { label: "Leads", to: "/reports/leads" },
  { label: "Finance", to: "/reports/finance" },
] as const;

function ReportsLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports"
        description="Analytics and exportable summaries across the agency."
      />
      <nav
        aria-label="Report sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/reports" }}
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
