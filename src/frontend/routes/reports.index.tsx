import { createFileRoute } from "@tanstack/react-router";
import { RevenueReportPage } from "@/modules/reports/frontend/pages/RevenueReportPage";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Revenue Report — AgencyOS" },
      { name: "description", content: "Revenue, receivables and client health analytics." },
    ],
  }),
  component: RevenueReportPage,
});
