import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

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

function FinanceLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Finance"
        description="Revenue, invoices, expenses and payments in one workspace."
      />
      <Outlet />
    </section>
  );
}
