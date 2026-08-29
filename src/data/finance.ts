// Finance & Reports mock data layer for AgencyOS.
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

export const invoices: Invoice[] = [
  {
    id: "inv-1001",
    number: "INV-1001",
    client: "Northwind Coffee",
    issueDate: "2026-07-01",
    dueDate: "2026-07-31",
    status: "paid",
    taxRate: 8,
    notes: "Thank you for your business.",
    paidOn: "2026-07-22",
    lineItems: [
      { id: "li-1", description: "Brand Refresh — Discovery Sprint", quantity: 1, rate: 18000 },
      { id: "li-2", description: "Creative Direction (July)", quantity: 40, rate: 175 },
    ],
  },
  {
    id: "inv-1002",
    number: "INV-1002",
    client: "Volta Motors",
    issueDate: "2026-07-05",
    dueDate: "2026-08-04",
    status: "paid",
    taxRate: 0,
    notes: "Q3 Paid Media retainer — month 1 of 3.",
    paidOn: "2026-07-30",
    lineItems: [
      { id: "li-1", description: "Paid Media Management Retainer", quantity: 1, rate: 42000 },
      { id: "li-2", description: "Ad Spend Management Fee", quantity: 1, rate: 16000 },
    ],
  },
  {
    id: "inv-1003",
    number: "INV-1003",
    client: "Helio Health",
    issueDate: "2026-07-10",
    dueDate: "2026-08-09",
    status: "overdue",
    taxRate: 6.5,
    notes: "Website Rebuild — Phase 1 milestone.",
    lineItems: [
      { id: "li-1", description: "UX Discovery & Wireframes", quantity: 1, rate: 22000 },
      { id: "li-2", description: "Design System Setup", quantity: 1, rate: 14500 },
    ],
  },
  {
    id: "inv-1004",
    number: "INV-1004",
    client: "Lumen Finance",
    issueDate: "2026-07-15",
    dueDate: "2026-08-14",
    status: "sent",
    taxRate: 0,
    notes: "Strategy engagement — July.",
    lineItems: [{ id: "li-1", description: "Account Strategy Retainer", quantity: 1, rate: 19500 }],
  },
  {
    id: "inv-1005",
    number: "INV-1005",
    client: "Terra Outdoor",
    issueDate: "2026-06-20",
    dueDate: "2026-07-20",
    status: "overdue",
    taxRate: 8,
    notes: "Past due — second reminder sent.",
    lineItems: [
      { id: "li-1", description: "Brand Campaign Concepting", quantity: 1, rate: 9500 },
      { id: "li-2", description: "Photography Production Day", quantity: 1, rate: 3000 },
    ],
  },
  {
    id: "inv-1006",
    number: "INV-1006",
    client: "Northwind Coffee",
    issueDate: "2026-08-01",
    dueDate: "2026-08-31",
    status: "sent",
    taxRate: 8,
    notes: "Content Engine — August retainer.",
    lineItems: [{ id: "li-1", description: "Editorial & Content Production", quantity: 1, rate: 11000 }],
  },
  {
    id: "inv-1007",
    number: "INV-1007",
    client: "Volta Motors",
    issueDate: "2026-08-03",
    dueDate: "2026-09-02",
    status: "draft",
    taxRate: 0,
    notes: "Launch Film — final delivery invoice.",
    lineItems: [
      { id: "li-1", description: "Launch Film Production", quantity: 1, rate: 48000 },
      { id: "li-2", description: "Color Grading & Sound Mix", quantity: 1, rate: 8500 },
    ],
  },
  {
    id: "inv-1008",
    number: "INV-1008",
    client: "Helio Health",
    issueDate: "2026-08-05",
    dueDate: "2026-09-04",
    status: "sent",
    taxRate: 6.5,
    notes: "Website Rebuild — Phase 2 milestone.",
    lineItems: [{ id: "li-1", description: "Frontend Build Sprint 1", quantity: 1, rate: 31000 }],
  },
  {
    id: "inv-1009",
    number: "INV-1009",
    client: "Lumen Finance",
    issueDate: "2026-08-10",
    dueDate: "2026-09-09",
    status: "paid",
    taxRate: 0,
    notes: "Strategy engagement — August.",
    paidOn: "2026-08-25",
    lineItems: [{ id: "li-1", description: "Account Strategy Retainer", quantity: 1, rate: 19500 }],
  },
  {
    id: "inv-1010",
    number: "INV-1010",
    client: "Terra Outdoor",
    issueDate: "2026-08-12",
    dueDate: "2026-09-11",
    status: "draft",
    taxRate: 8,
    notes: "Fall campaign kickoff.",
    lineItems: [{ id: "li-1", description: "Campaign Strategy & Planning", quantity: 1, rate: 7200 }],
  },
  {
    id: "inv-1011",
    number: "INV-1011",
    client: "Northwind Coffee",
    issueDate: "2026-05-15",
    dueDate: "2026-06-14",
    status: "overdue",
    taxRate: 8,
    notes: "Past due — flagged for collections.",
    lineItems: [{ id: "li-1", description: "Content Engine — May retainer", quantity: 1, rate: 11000 }],
  },
  {
    id: "inv-1012",
    number: "INV-1012",
    client: "Volta Motors",
    issueDate: "2026-08-18",
    dueDate: "2026-09-17",
    status: "sent",
    taxRate: 0,
    notes: "Q3 Paid Media retainer — month 2 of 3.",
    lineItems: [
      { id: "li-1", description: "Paid Media Management Retainer", quantity: 1, rate: 42000 },
      { id: "li-2", description: "Ad Spend Management Fee", quantity: 1, rate: 16500 },
    ],
  },
  {
    id: "inv-1013",
    number: "INV-1013",
    client: "Helio Health",
    issueDate: "2026-08-20",
    dueDate: "2026-09-19",
    status: "sent",
    taxRate: 6.5,
    notes: "Website Rebuild — QA & launch support.",
    lineItems: [{ id: "li-1", description: "QA & Launch Support", quantity: 1, rate: 9800 }],
  },
  {
    id: "inv-1014",
    number: "INV-1014",
    client: "Lumen Finance",
    issueDate: "2026-08-25",
    dueDate: "2026-09-24",
    status: "draft",
    taxRate: 0,
    notes: "Q4 planning workshop proposal.",
    lineItems: [{ id: "li-1", description: "Q4 Planning Workshop", quantity: 1, rate: 6500 }],
  },
];

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

export const expenses: Expense[] = [
  { id: "ex-1", vendor: "Adobe", category: "Software", date: "2026-08-01", amount: 2400, status: "approved", submittedBy: "Amara Okafor" },
  { id: "ex-2", vendor: "Meta Ads Platform", category: "Media Spend", date: "2026-08-03", amount: 58000, status: "approved", submittedBy: "Kenji Tanaka" },
  { id: "ex-3", vendor: "Freelance Editor — J. Ruiz", category: "Contractors", date: "2026-08-04", amount: 4200, status: "approved", submittedBy: "Noah Feldman" },
  { id: "ex-4", vendor: "United Airlines", category: "Travel", date: "2026-08-06", amount: 860, status: "approved", submittedBy: "Marcus Doyle" },
  { id: "ex-5", vendor: "WeWork", category: "Office", date: "2026-08-01", amount: 12500, status: "approved", submittedBy: "Ivy Chen" },
  { id: "ex-6", vendor: "Sony Rentals", category: "Production", date: "2026-08-08", amount: 3100, status: "pending", submittedBy: "Noah Feldman" },
  { id: "ex-7", vendor: "Figma", category: "Software", date: "2026-08-01", amount: 780, status: "approved", submittedBy: "Liam Bennett" },
  { id: "ex-8", vendor: "Deloitte Advisory", category: "Professional Services", date: "2026-08-10", amount: 9500, status: "pending", submittedBy: "Ivy Chen" },
  { id: "ex-9", vendor: "Google Ads Platform", category: "Media Spend", date: "2026-08-12", amount: 41000, status: "approved", submittedBy: "Kenji Tanaka" },
  { id: "ex-10", vendor: "Freelance Copywriter — R. Singh", category: "Contractors", date: "2026-08-14", amount: 2800, status: "rejected", submittedBy: "Fatima Zahra" },
  { id: "ex-11", vendor: "Delta Airlines", category: "Travel", date: "2026-08-15", amount: 1120, status: "approved", submittedBy: "Sofia Marchetti" },
  { id: "ex-12", vendor: "Slack", category: "Software", date: "2026-08-01", amount: 640, status: "approved", submittedBy: "Ivy Chen" },
  { id: "ex-13", vendor: "Location Scout LLC", category: "Production", date: "2026-08-18", amount: 5200, status: "pending", submittedBy: "Noah Feldman" },
  { id: "ex-14", vendor: "Marriott", category: "Travel", date: "2026-08-19", amount: 940, status: "approved", submittedBy: "Marcus Doyle" },
  { id: "ex-15", vendor: "Legal Counsel — Bright & Cho", category: "Professional Services", date: "2026-08-21", amount: 6800, status: "approved", submittedBy: "Daniel Reyes" },
  { id: "ex-16", vendor: "TikTok Ads Platform", category: "Media Spend", date: "2026-08-22", amount: 27500, status: "pending", submittedBy: "Kenji Tanaka" },
];

export const expenseCategoryTotals = () => {
  const totals = new Map<string, number>();
  for (const e of expenses) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  return Array.from(totals, ([category, amount]) => ({ category, amount }));
};

export type AgingBucket = "0-30" | "31-60" | "61-90" | "90+";

export const agingByClient: { client: string; "0-30": number; "31-60": number; "61-90": number; "90+": number }[] = [
  { client: "Northwind Coffee", "0-30": 11880, "31-60": 0, "61-90": 0, "90+": 11880 },
  { client: "Volta Motors", "0-30": 66700, "31-60": 0, "61-90": 0, "90+": 0 },
  { client: "Helio Health", "0-30": 0, "31-60": 38830, "61-90": 0, "90+": 0 },
  { client: "Lumen Finance", "0-30": 19500, "31-60": 0, "61-90": 0, "90+": 0 },
  { client: "Terra Outdoor", "0-30": 0, "31-60": 0, "61-90": 13500, "90+": 0 },
];

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

export const attendanceTrend = [
  { week: "Wk1", present: 94, late: 4, absent: 2 },
  { week: "Wk2", present: 91, late: 6, absent: 3 },
  { week: "Wk3", present: 96, late: 3, absent: 1 },
  { week: "Wk4", present: 93, late: 5, absent: 2 },
  { week: "Wk5", present: 97, late: 2, absent: 1 },
  { week: "Wk6", present: 90, late: 7, absent: 3 },
];

export const departmentAttendance = [
  { department: "Creative", attendanceRate: 96, avgHours: 7.8, lateArrivals: 3 },
  { department: "Media", attendanceRate: 93, avgHours: 8.1, lateArrivals: 5 },
  { department: "Strategy", attendanceRate: 91, avgHours: 7.6, lateArrivals: 4 },
  { department: "Engineering", attendanceRate: 97, avgHours: 8.0, lateArrivals: 2 },
  { department: "Operations", attendanceRate: 95, avgHours: 7.9, lateArrivals: 2 },
  { department: "Sales", attendanceRate: 89, avgHours: 8.3, lateArrivals: 6 },
];

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

export const onTimeDeliveryRate = 82;

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

export const receivablesTrend = [
  { month: "Mar", receivables: 62000 },
  { month: "Apr", receivables: 71000 },
  { month: "May", receivables: 68500 },
  { month: "Jun", receivables: 79000 },
  { month: "Jul", receivables: 84200 },
  { month: "Aug", receivables: 91650 },
];
