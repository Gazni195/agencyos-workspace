import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { EmployeesLayout } from "@/modules/employees/frontend/pages/EmployeesLayout";

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
