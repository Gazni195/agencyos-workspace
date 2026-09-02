import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/modules/finance/frontend/pages/PaymentsPage";

export const Route = createFileRoute("/finance/payments")({
  head: () => ({
    meta: [
      { title: "Payments — AgencyOS" },
      { name: "description", content: "Payment history and outstanding receivables in AgencyOS." },
    ],
  }),
  component: PaymentsPage,
});
