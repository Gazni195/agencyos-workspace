import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employees — AgencyOS" },
      {
        name: "description",
        content: "Manage your agency team, attendance, leave, payroll and performance in AgencyOS.",
      },
      { property: "og:title", content: "Employees — AgencyOS" },
      {
        property: "og:description",
        content: "Manage your agency team, attendance, leave, payroll and performance in AgencyOS.",
      },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Employees">
      <EmployeesLayout />
    </RequireModuleAccess>
  ),
});

function EmployeesLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Employees"
        description="Directory, attendance, leave, payroll and performance in one HR workspace."
      />
      <Outlet />
    </section>
  );
}
