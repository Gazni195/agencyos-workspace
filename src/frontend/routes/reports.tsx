import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { ReportsLayout } from "@/modules/reports/frontend/pages/ReportsLayout";

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
