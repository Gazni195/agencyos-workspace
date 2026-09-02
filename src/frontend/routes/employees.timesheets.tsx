import { createFileRoute } from "@tanstack/react-router";
import { TimesheetsPage } from "@/modules/employees/frontend/pages/TimesheetsPage";

export const Route = createFileRoute("/employees/timesheets")({
  head: () => ({
    meta: [
      { title: "Timesheets — AgencyOS" },
      { name: "description", content: "Review submitted hours and billable utilization." },
      { property: "og:title", content: "Timesheets — AgencyOS" },
      { property: "og:description", content: "Review submitted hours and billable utilization." },
    ],
  }),
  component: TimesheetsPage,
});
