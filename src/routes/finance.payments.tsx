import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, CheckCircle2, Wallet } from "lucide-react";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { EmptyState } from "@/shared/frontend/components/EmptyState";
import { useFinanceStore } from "@/modules/finance/frontend/store/financeStore";
import { invoiceTotal } from "@/modules/finance/types";
import { money } from "@/shared/frontend/utils/money";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";

export const Route = createFileRoute("/finance/payments")({
  head: () => ({
    meta: [
      { title: "Payments — AgencyOS" },
      { name: "description", content: "Payment history and outstanding receivables in AgencyOS." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const invoices = useFinanceStore((s) => s.invoices);
  const clients = useClientsStore((s) => s.clients);
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? "Unknown client";

  const paid = useMemo(
    () =>
      [...invoices.filter((i) => i.status === "paid" && i.paidOn)].sort((a, b) =>
        (b.paidOn ?? "").localeCompare(a.paidOn ?? ""),
      ),
    [invoices],
  );

  const totalReceived = paid.reduce((sum, i) => sum + invoiceTotal(i), 0);
  const outstanding = invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const outstandingTotal = outstanding.reduce((sum, i) => sum + invoiceTotal(i), 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  const avgDaysToPay = useMemo(() => {
    const withBoth = paid.filter((i) => i.paidOn);
    if (withBoth.length === 0) return 0;
    const totalDays = withBoth.reduce((sum, i) => {
      const days = (new Date(i.paidOn!).getTime() - new Date(i.issueDate).getTime()) / 86400000;
      return sum + days;
    }, 0);
    return Math.round(totalDays / withBoth.length);
  }, [paid]);

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Track received payments and outstanding receivables."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Total received" value={money(totalReceived)} icon={CheckCircle2} />
        <KpiCard
          label="Outstanding"
          value={money(outstandingTotal)}
          hint={`${outstanding.length} invoices`}
          icon={Wallet}
        />
        <KpiCard label="Overdue" value={String(overdueCount)} icon={AlertTriangle} />
        <KpiCard label="Avg. days to pay" value={`${avgDaysToPay}d`} icon={CalendarClock} />
      </div>

      <div className="surface-card mt-5 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Payment history</p>
        </div>
        {paid.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No payments yet" description="Paid invoices will show up here." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Paid on</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paid.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {clientName(inv.clientId)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{inv.issueDate}</TableCell>
                    <TableCell className="text-muted-foreground">{inv.paidOn}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {money(invoiceTotal(inv))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
