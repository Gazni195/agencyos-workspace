// Types & seed data for the Finance module.
//
// Live aggregates (expense category mix, receivables aging, project
// budget/status, client revenue/retention, revenue & margin trend) are NOT
// defined here — they're computed from real store data in
// modules/reports/frontend/services/financeReportsService.ts, since
// deriving them once at import time from these seed arrays (which stay
// empty) would freeze them forever.
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
