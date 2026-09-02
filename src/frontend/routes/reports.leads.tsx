import { createFileRoute } from "@tanstack/react-router";
import { LeadsReportPage } from "@/modules/reports/frontend/pages/LeadsReportPage";

export const Route = createFileRoute("/reports/leads")({
  head: () => ({
    meta: [
      { title: "Lead Reports — AgencyOS" },
      { name: "description", content: "Pipeline value, win rate and source performance." },
    ],
  }),
  component: LeadsReportPage,
});
