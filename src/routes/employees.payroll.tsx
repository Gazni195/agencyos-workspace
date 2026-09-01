import { createFileRoute } from "@tanstack/react-router";
import { PayrollPage } from "@/modules/employees/frontend/pages/PayrollPage";

export const Route = createFileRoute("/employees/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll — AgencyOS" },
      {
        name: "description",
        content: "Review payroll summaries, compensation and payslip status.",
      },
      { property: "og:title", content: "Payroll — AgencyOS" },
      {
        property: "og:description",
        content: "Review payroll summaries, compensation and payslip status.",
      },
    ],
  }),
  component: PayrollPage,
});
