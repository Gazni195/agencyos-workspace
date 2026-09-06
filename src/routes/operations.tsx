import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

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

function OperationsLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Operations"
        description="What's pending, who's working on it, and what clients are waiting for."
      />
      <Outlet />
    </section>
  );
}
