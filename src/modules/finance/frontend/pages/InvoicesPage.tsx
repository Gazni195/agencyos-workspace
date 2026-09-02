import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { SearchBar } from "@/shared/frontend/components/SearchBar";
import { FilterBar, type FilterDef } from "@/shared/frontend/components/FilterBar";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { DrawerPanel } from "@/shared/frontend/components/DrawerPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/frontend/components/ui/select";
import { InvoiceFormDialog } from "@/modules/finance/frontend/components/InvoiceFormDialog";
import { useFinanceStore } from "@/modules/finance/frontend/store/financeStore";
import {
  invoiceSubtotal,
  invoiceTax,
  invoiceTotal,
  type Invoice,
  type InvoiceStatus,
} from "@/modules/finance/types";
import { money } from "@/shared/frontend/utils/money";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";

export const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

export function InvoicesPage() {
  const invoices = useFinanceStore((s) => s.invoices);
  const addInvoice = useFinanceStore((s) => s.addInvoice);
  const setInvoiceStatus = useFinanceStore((s) => s.setInvoiceStatus);
  const clients = useClientsStore((s) => s.clients);
  const clientName = useCallback(
    (clientId: string) => clients.find((c) => c.id === clientId)?.name ?? "Unknown client",
    [clients],
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = invoices.find((i) => i.id === selectedId) ?? null;

  const filtered = useMemo(
    () =>
      invoices.filter((i) => {
        if (
          query.trim() &&
          !`${i.number} ${clientName(i.clientId)}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        )
          return false;
        if (status !== "all" && i.status !== status) return false;
        return true;
      }),
    [invoices, clientName, query, status],
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
    {
      key: "client",
      header: "Client",
      sortValue: (i) => clientName(i.clientId),
      render: (i) => clientName(i.clientId),
    },
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
        description={selected ? clientName(selected.clientId) : undefined}
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
