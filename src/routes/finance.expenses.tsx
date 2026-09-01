import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { SearchBar } from "@/shared/frontend/components/SearchBar";
import { FilterBar, type FilterDef } from "@/shared/frontend/components/FilterBar";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { Button } from "@/shared/frontend/components/ui/button";
import { ExpenseFormDialog } from "@/modules/finance/frontend/components/ExpenseFormDialog";
import { useFinanceStore } from "@/modules/finance/frontend/store/financeStore";
import { type Expense } from "@/modules/finance/types";
import { money } from "@/shared/frontend/utils/money";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";

export const Route = createFileRoute("/finance/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — AgencyOS" },
      { name: "description", content: "Review and approve agency expenses in AgencyOS." },
    ],
  }),
  component: ExpensesPage,
});

const statuses: Expense["status"][] = ["pending", "approved", "rejected"];

function ExpensesPage() {
  const expenses = useFinanceStore((s) => s.expenses);
  const addExpense = useFinanceStore((s) => s.addExpense);
  const setExpenseStatus = useFinanceStore((s) => s.setExpenseStatus);
  const clients = useClientsStore((s) => s.clients);
  const projects = useProjectsStore((s) => s.projects);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      expenses.filter((e) => {
        if (
          query.trim() &&
          !`${e.vendor} ${e.category}`.toLowerCase().includes(query.trim().toLowerCase())
        )
          return false;
        if (status !== "all" && e.status !== status) return false;
        return true;
      }),
    [expenses, query, status],
  );

  const filters: FilterDef[] = [
    {
      id: "status",
      label: "Status",
      value: status,
      onChange: setStatus,
      options: statuses.map((s) => ({ label: s, value: s })),
    },
  ];

  const columns: Column<Expense>[] = [
    {
      key: "vendor",
      header: "Vendor",
      sortValue: (e) => e.vendor,
      render: (e) => <span className="font-medium">{e.vendor}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortValue: (e) => e.category,
      render: (e) => <span className="text-muted-foreground">{e.category}</span>,
    },
    {
      key: "date",
      header: "Date",
      sortValue: (e) => e.date,
      render: (e) => <span className="text-muted-foreground">{e.date}</span>,
    },
    {
      key: "submittedBy",
      header: "Submitted by",
      sortValue: (e) => e.submittedBy,
      render: (e) => <span className="text-muted-foreground">{e.submittedBy}</span>,
    },
    {
      key: "attribution",
      header: "Client / Project",
      render: (e) => {
        const clientName = e.clientId ? clients.find((c) => c.id === e.clientId)?.name : undefined;
        const projectName = e.projectId
          ? projects.find((p) => p.id === e.projectId)?.name
          : undefined;
        if (!clientName && !projectName) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="text-muted-foreground">
            {[clientName, projectName].filter(Boolean).join(" · ")}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortValue: (e) => e.amount,
      render: (e) => money(e.amount),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (e) => e.status,
      render: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (e) =>
        e.status === "pending" && (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(evt) => evt.stopPropagation()}
          >
            <Button
              variant="outline"
              size="icon"
              className="size-7 text-success hover:bg-success/12 hover:text-success"
              aria-label={`Approve ${e.vendor}`}
              onClick={() => {
                setExpenseStatus(e.id, "approved");
                toast.success(`Approved ${e.vendor}`);
              }}
            >
              <Check className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
              aria-label={`Reject ${e.vendor}`}
              onClick={() => {
                setExpenseStatus(e.id, "rejected");
                toast.error(`Rejected ${e.vendor}`);
              }}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ),
    },
  ];

  const pendingTotal = expenses
    .filter((e) => e.status === "pending")
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <PageHeader
        title="Expenses"
        description={`${expenses.length} expenses · ${money(pendingTotal)} awaiting approval`}
        actions={<ExpenseFormDialog onCreate={addExpense} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search vendor or category…"
          className="max-w-sm"
        />
        <FilterBar filters={filters} onReset={() => setStatus("all")} />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(e) => e.id}
        emptyTitle="No expenses match your filters"
        emptyDescription="Try a different search term or reset your filters."
      />
    </div>
  );
}
