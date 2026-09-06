import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

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

function ReportsLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports"
        description="Analytics and exportable summaries across the agency."
      />
      <Outlet />
    </section>
  );
}
