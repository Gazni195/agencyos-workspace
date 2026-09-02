import { createFileRoute } from "@tanstack/react-router";
import { InvoicesPage } from "@/modules/finance/frontend/pages/InvoicesPage";

export const Route = createFileRoute("/finance/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — AgencyOS" },
      { name: "description", content: "Track and manage client invoices in AgencyOS." },
    ],
  }),
  component: InvoicesPage,
});
