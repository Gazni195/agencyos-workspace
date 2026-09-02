import { createFileRoute } from "@tanstack/react-router";
import { FinanceReportPage } from "@/modules/reports/frontend/pages/FinanceReportPage";

export const Route = createFileRoute("/reports/finance")({
  head: () => ({
    meta: [
      { title: "Finance Reports — AgencyOS" },
      { name: "description", content: "Receivables aging, expense mix and profit trend." },
    ],
  }),
  component: FinanceReportPage,
});
