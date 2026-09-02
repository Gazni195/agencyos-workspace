import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { FinanceLayout } from "@/modules/finance/frontend/pages/FinanceLayout";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance — AgencyOS" },
      { name: "description", content: "Monitor agency finances, invoices, expenses and payments." },
      { property: "og:title", content: "Finance — AgencyOS" },
      {
        property: "og:description",
        content: "Monitor agency finances, invoices, expenses and payments.",
      },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Finance">
      <FinanceLayout />
    </RequireModuleAccess>
  ),
});
