// Finance & Reports data layer for AgencyOS.
import { clients, projects, revenueTrend } from "@/data/agency";

export type InvoiceStatus = "paid" | "sent" | "overdue" | "draft";

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type Invoice = {
  id: string;
  number: string;
  client: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  taxRate: number;
  notes: string;
  lineItems: InvoiceLineItem[];
  paidOn?: string;
};

export const invoiceSubtotal = (inv: Invoice) =>
  inv.lineItems.reduce((sum, li) => sum + li.quantity * li.rate, 0);
export const invoiceTax = (inv: Invoice) => invoiceSubtotal(inv) * (inv.taxRate / 100);
export const invoiceTotal = (inv: Invoice) => invoiceSubtotal(inv) + invoiceTax(inv);

export const invoices: Invoice[] = [];

export type ExpenseStatus = "approved" | "pending" | "rejected";
export type ExpenseCategory =
  | "Software"
  | "Contractors"
  | "Travel"
  | "Media Spend"
  | "Office"
  | "Production"
  | "Professional Services";

export type Expense = {
  id: string;
  vendor: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  status: ExpenseStatus;
  submittedBy: string;
};

export const expenses: Expense[] = [];

export const expenseCategoryTotals = () => {
  const totals = new Map<string, number>();
  for (const e of expenses) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  return Array.from(totals, ([category, amount]) => ({ category, amount }));
};

export type AgingBucket = "0-30" | "31-60" | "61-90" | "90+";

export const agingByClient: {
  client: string;
  "0-30": number;
  "31-60": number;
  "61-90": number;
  "90+": number;
}[] = [];

export const agingSummary = () => {
  const totals: Record<AgingBucket, number> = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
  for (const row of agingByClient) {
    totals["0-30"] += row["0-30"];
    totals["31-60"] += row["31-60"];
    totals["61-90"] += row["61-90"];
    totals["90+"] += row["90+"];
  }
  return totals;
};

// ---------- Reports module aggregates ----------

export const attendanceTrend: { week: string; present: number; late: number; absent: number }[] =
  [];

export const departmentAttendance: {
  department: string;
  attendanceRate: number;
  avgHours: number;
  lateArrivals: number;
}[] = [];

export const projectStatusDistribution = [
  { status: "On Track", value: projects.filter((p) => p.status === "on-track").length },
  { status: "At Risk", value: projects.filter((p) => p.status === "at-risk").length },
  { status: "Delayed", value: projects.filter((p) => p.status === "delayed").length },
];

export const projectBudgetActual = projects.map((p) => ({
  name: p.name,
  budget: p.budget,
  actual: Math.round(p.budget * (0.55 + (p.progress / 100) * 0.5)),
}));

export const onTimeDeliveryRate = 0;

export const clientRevenue = clients.map((c) => ({ client: c.name, revenue: c.mrr * 12 }));

export const clientHealthDistribution = [
  { health: "Healthy", value: clients.filter((c) => c.health === "healthy").length },
  { health: "At Risk", value: clients.filter((c) => c.health === "at-risk").length },
  { health: "Churn Risk", value: clients.filter((c) => c.health === "churn-risk").length },
];

export const clientRetention = clients.map((c) => ({
  client: c.name,
  tenureMonths: [18, 26, 9, 12, 14][clients.indexOf(c)] ?? 12,
  renewalProbability: c.health === "healthy" ? 92 : c.health === "at-risk" ? 61 : 34,
  mrr: c.mrr,
}));

export const financialTrend = revenueTrend.map((r) => ({
  ...r,
  margin: Math.round(((r.revenue - r.costs) / r.revenue) * 1000) / 10,
}));

export const receivablesTrend: { month: string; receivables: number }[] = [];
