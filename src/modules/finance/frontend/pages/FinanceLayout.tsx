import { Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { cn } from "@/shared/frontend/utils/utils";

export const tabs = [
  { label: "Revenue", to: "/finance" },
  { label: "Invoices", to: "/finance/invoices" },
  { label: "Expenses", to: "/finance/expenses" },
  { label: "Payments", to: "/finance/payments" },
] as const;

export function FinanceLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Finance"
        description="Revenue, invoices, expenses and payments in one workspace."
      />
      <nav
        aria-label="Finance sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/finance" }}
            className="shrink-0 rounded-t-lg border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{
              className: cn(
                "shrink-0 rounded-t-lg border-b-2 border-primary px-3.5 py-2.5 text-sm font-semibold text-foreground",
              ),
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </section>
  );
}
