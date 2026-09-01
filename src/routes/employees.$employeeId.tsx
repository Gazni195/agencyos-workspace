import { createFileRoute } from "@tanstack/react-router";
import { EmployeeProfilePage } from "@/modules/employees/frontend/pages/EmployeeProfilePage";

export const Route = createFileRoute("/employees/$employeeId")({
  head: ({ params }) => ({
    meta: [
      { title: `Employee Profile — AgencyOS` },
      { name: "description", content: `Profile details for employee ${params.employeeId}.` },
      { property: "og:title", content: "Employee Profile — AgencyOS" },
      { property: "og:description", content: "View employee profile details in AgencyOS." },
    ],
  }),
  component: EmployeeProfilePage,
});
