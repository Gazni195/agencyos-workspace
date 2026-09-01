// Finance & Reports aggregation. Pure functions over live store data (passed
// in by the caller via the relevant useXStore hook) rather than the static,
// permanently-empty seed arrays in src/data — so every chart here reacts to
// clients, projects, invoices and expenses actually created through the UI.
// Swapping to ERPNext later means feeding these the same shapes from API
// responses instead of store state; no UI refactor required.
import { invoiceTotal, type Expense, type Invoice } from "@/modules/finance/types";
import type { Client } from "@/modules/clients/types";
import type { DeliveryProject } from "@/modules/projects/types";

export type AgingBucket = "0-30" | "31-60" | "61-90" | "90+";
export type AgingRow = { client: string } & Record<AgingBucket, number>;

const monthKey = (dateStr: string) => dateStr.slice(0, 7);
const monthLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });

function agingBucketFor(dueDate: string): AgingBucket {
  const days = Math.floor((Date.now() - new Date(dueDate).getTime()) / 86_400_000);
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "90+";
}

export function computeExpenseCategoryTotals(expenses: Expense[]) {
  const totals = new Map<string, number>();
  for (const e of expenses) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  return Array.from(totals, ([category, amount]) => ({ category, amount }));
}

export function computeAgingByClient(invoices: Invoice[], clients: Client[]): AgingRow[] {
  const outstanding = invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const byClient = new Map<string, AgingRow>();
  for (const inv of outstanding) {
    const clientName = clients.find((c) => c.id === inv.clientId)?.name ?? "Unknown client";
    const row = byClient.get(clientName) ?? {
      client: clientName,
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    };
    row[agingBucketFor(inv.dueDate)] += invoiceTotal(inv);
    byClient.set(clientName, row);
  }
  return Array.from(byClient.values());
}

export function computeAgingSummary(agingByClient: AgingRow[]): Record<AgingBucket, number> {
  const totals: Record<AgingBucket, number> = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
  for (const row of agingByClient) {
    totals["0-30"] += row["0-30"];
    totals["31-60"] += row["31-60"];
    totals["61-90"] += row["61-90"];
    totals["90+"] += row["90+"];
  }
  return totals;
}

export function computeProjectStatusDistribution(projects: DeliveryProject[]) {
  return [
    { status: "On Track", value: projects.filter((p) => p.status === "on-track").length },
    { status: "At Risk", value: projects.filter((p) => p.status === "at-risk").length },
    { status: "Delayed", value: projects.filter((p) => p.status === "delayed").length },
  ];
}

export function computeProjectBudgetActual(projects: DeliveryProject[]) {
  return projects.map((p) => ({ name: p.name, budget: p.budget, actual: p.spend }));
}

export function computeOnTimeDeliveryRate(projects: DeliveryProject[]) {
  if (projects.length === 0) return 0;
  const delayed = projects.filter((p) => p.status === "delayed").length;
  return Math.round(((projects.length - delayed) / projects.length) * 100);
}

export function computeClientRevenue(clients: Client[]) {
  return clients.map((c) => ({ client: c.name, revenue: c.mrr * 12 }));
}

export function computeClientHealthDistribution(clients: Client[]) {
  return [
    { health: "Healthy", value: clients.filter((c) => c.health === "healthy").length },
    { health: "At Risk", value: clients.filter((c) => c.health === "at-risk").length },
    { health: "Churn Risk", value: clients.filter((c) => c.health === "churn-risk").length },
  ];
}

function tenureMonthsSince(since: string) {
  const start = new Date(since);
  const now = new Date();
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, months);
}

export function computeClientRetention(clients: Client[]) {
  return clients.map((c) => ({
    client: c.name,
    tenureMonths: tenureMonthsSince(c.since),
    renewalProbability: c.health === "healthy" ? 92 : c.health === "at-risk" ? 61 : 34,
    mrr: c.mrr,
  }));
}

export function computeFinancialTrend(invoices: Invoice[], expenses: Expense[]) {
  const paid = invoices.filter((i) => i.status === "paid" && i.paidOn);
  const approvedExpenses = expenses.filter((e) => e.status === "approved");

  const months = new Map<string, { label: string; revenue: number; costs: number }>();
  for (const inv of paid) {
    const key = monthKey(inv.paidOn!);
    const entry = months.get(key) ?? { label: monthLabel(inv.paidOn!), revenue: 0, costs: 0 };
    entry.revenue += invoiceTotal(inv);
    months.set(key, entry);
  }
  for (const e of approvedExpenses) {
    const key = monthKey(e.date);
    const entry = months.get(key) ?? { label: monthLabel(e.date), revenue: 0, costs: 0 };
    entry.costs += e.amount;
    months.set(key, entry);
  }

  return Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({
      month: v.label,
      revenue: v.revenue,
      costs: v.costs,
      margin: v.revenue ? Math.round(((v.revenue - v.costs) / v.revenue) * 1000) / 10 : 0,
    }));
}

export function computeReceivablesTrend(invoices: Invoice[]) {
  const outstanding = invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const months = new Map<string, { label: string; receivables: number }>();
  for (const inv of outstanding) {
    const key = monthKey(inv.issueDate);
    const entry = months.get(key) ?? { label: monthLabel(inv.issueDate), receivables: 0 };
    entry.receivables += invoiceTotal(inv);
    months.set(key, entry);
  }
  return Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ month: v.label, receivables: v.receivables }));
}
