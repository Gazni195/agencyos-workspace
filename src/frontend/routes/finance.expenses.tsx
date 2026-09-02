import { createFileRoute } from "@tanstack/react-router";
import { ExpensesPage } from "@/modules/finance/frontend/pages/ExpensesPage";

export const Route = createFileRoute("/finance/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — AgencyOS" },
      { name: "description", content: "Review and approve agency expenses in AgencyOS." },
    ],
  }),
  component: ExpensesPage,
});
