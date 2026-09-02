import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { OperationsLayout } from "@/modules/operations/frontend/pages/OperationsLayout";

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
