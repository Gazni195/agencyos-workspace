import { createFileRoute } from "@tanstack/react-router";
import { EmployeesReportPage } from "@/modules/reports/frontend/pages/EmployeesReportPage";

export const Route = createFileRoute("/reports/employees")({
  head: () => ({
    meta: [
      { title: "Employee Reports — AgencyOS" },
      { name: "description", content: "Attendance, performance and utilization by department." },
    ],
  }),
  component: EmployeesReportPage,
});
