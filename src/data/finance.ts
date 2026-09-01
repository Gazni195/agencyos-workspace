// Finance & Reports data layer for AgencyOS.
//
// Live aggregates (expense category mix, receivables aging, project
// budget/status, client revenue/retention, revenue & margin trend) are NOT
// defined here — they're computed from real store data in
// src/services/financeReportsService.ts, since deriving them once at import
// time from these seed arrays (which stay empty) would freeze them forever.
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
  clientId: string;
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
  clientId?: string;
  projectId?: string;
};

export const expenses: Expense[] = [];

export type AgingBucket = "0-30" | "31-60" | "61-90" | "90+";

// ---------- Reports module aggregates ----------
//
// attendanceTrend/departmentAttendance are deliberately left out of Phase F:
// they derive from src/data/agency.ts's `attendance` array, which has no
// creation path anywhere in the app (no clock-in/clock-out or attendance
// entry flow exists), unlike invoices/expenses/clients/projects below which
// are all created through real UI. Wiring these to "live" data with nothing
// that can ever populate it would just be the same frozen-data bug in a new
// shape, so the Reports > Employees attendance chart stays on this
// permanently-empty seed rather than pretending to be live.

export const attendanceTrend: { week: string; present: number; late: number; absent: number }[] =
  [];

export const departmentAttendance: {
  department: string;
  attendanceRate: number;
  avgHours: number;
  lateArrivals: number;
}[] = [];
