import { createFileRoute } from "@tanstack/react-router";
import { FinanceRevenuePage } from "@/modules/finance/frontend/pages/FinanceRevenuePage";

export const Route = createFileRoute("/finance/")({
  head: () => ({
    meta: [
      { title: "Revenue — AgencyOS" },
      { name: "description", content: "Revenue, receivables and profit metrics for the agency." },
    ],
  }),
  component: FinanceRevenuePage,
});
