import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterBar, type FilterDef } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DrawerPanel } from "@/components/shared/DrawerPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceFormDialog } from "@/components/finance/InvoiceFormDialog";
import { useFinanceStore } from "@/store/financeStore";
import {
  invoiceSubtotal,
  invoiceTax,
  invoiceTotal,
  type Invoice,
  type InvoiceStatus,
} from "@/data/finance";
import { money } from "@/data/agency";

export const Route = createFileRoute("/finance/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — AgencyOS" },
      { name: "description", content: "Track and manage client invoices in AgencyOS." },
    ],
  }),
  component: InvoicesPage,
});

const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

function InvoicesPage() {
  const invoices = useFinanceStore((s) => s.invoices);
  const addInvoice = useFinanceStore((s) => s.addInvoice);
  const setInvoiceStatus = useFinanceStore((s) => s.setInvoiceStatus);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = invoices.find((i) => i.id === selectedId) ?? null;

  const filtered = useMemo(
    () =>
      invoices.filter((i) => {
        if (
          query.trim() &&
          !`${i.number} ${i.client}`.toLowerCase().includes(query.trim().toLowerCase())
        )
          return false;
        if (status !== "all" && i.status !== status) return false;
        return true;
      }),
    [invoices, query, status],
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

  const columns: Column<Invoice>[] = [
    {
      key: "number",
      header: "Invoice",
      sortValue: (i) => i.number,
      render: (i) => <span className="font-medium">{i.number}</span>,
    },
    { key: "client", header: "Client", sortValue: (i) => i.client, render: (i) => i.client },
    {
      key: "issueDate",
      header: "Issued",
      sortValue: (i) => i.issueDate,
      render: (i) => <span className="text-muted-foreground">{i.issueDate}</span>,
    },
    {
      key: "dueDate",
      header: "Due",
      sortValue: (i) => i.dueDate,
      render: (i) => <span className="text-muted-foreground">{i.dueDate}</span>,
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      sortValue: (i) => invoiceTotal(i),
      render: (i) => money(invoiceTotal(i)),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (i) => i.status,
      render: (i) => <StatusBadge status={i.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices · ${money(invoices.reduce((s, i) => s + invoiceTotal(i), 0))} billed`}
        actions={<InvoiceFormDialog onCreate={addInvoice} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search invoice or client…"
          className="max-w-sm"
        />
        <FilterBar filters={filters} onReset={() => setStatus("all")} />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(i) => i.id}
        onRowClick={(i) => setSelectedId(i.id)}
        emptyTitle="No invoices match your filters"
        emptyDescription="Try a different search term or reset your filters."
      />

      <DrawerPanel
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.number ?? "Invoice"}
        description={selected?.client}
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Issued</p>
                <p className="font-medium">{selected.issueDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due</p>
                <p className="font-medium">{selected.dueDate}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Status</p>
              <Select
                value={selected.status}
                onValueChange={(v) => setInvoiceStatus(selected.id, v as InvoiceStatus)}
              >
                <SelectTrigger className="h-9 w-full" aria-label="Invoice status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Line items</p>
              <ul className="space-y-2">
                {selected.lineItems.map((li) => (
                  <li key={li.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {li.description} <span className="text-xs">× {li.quantity}</span>
                    </span>
                    <span className="font-medium">{money(li.quantity * li.rate)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 border-t border-border pt-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{money(invoiceSubtotal(selected))}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Tax ({selected.taxRate}%)</span>
                <span>{money(invoiceTax(selected))}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{money(invoiceTotal(selected))}</span>
              </div>
            </div>

            {selected.notes && <p className="text-sm text-muted-foreground">{selected.notes}</p>}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
