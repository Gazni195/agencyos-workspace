import { createFileRoute } from "@tanstack/react-router";
import { LeavePage } from "@/modules/employees/frontend/pages/LeavePage";

export const Route = createFileRoute("/employees/leave")({
  head: () => ({
    meta: [
      { title: "Leave Management — AgencyOS" },
      { name: "description", content: "Review leave balances and employee time-off requests." },
      { property: "og:title", content: "Leave Management — AgencyOS" },
      {
        property: "og:description",
        content: "Review leave balances and employee time-off requests.",
      },
    ],
  }),
  component: LeavePage,
});
