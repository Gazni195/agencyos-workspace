import { createFileRoute } from "@tanstack/react-router";
import { EmployeeSettingsPage } from "@/modules/employees/frontend/pages/EmployeeSettingsPage";

export const Route = createFileRoute("/employees/settings")({
  head: () => ({
    meta: [
      { title: "Employee Settings — AgencyOS" },
      {
        name: "description",
        content: "Configure attendance, leave and employee workflow settings.",
      },
      { property: "og:title", content: "Employee Settings — AgencyOS" },
      {
        property: "og:description",
        content: "Configure attendance, leave and employee workflow settings.",
      },
    ],
  }),
  component: EmployeeSettingsPage,
});
