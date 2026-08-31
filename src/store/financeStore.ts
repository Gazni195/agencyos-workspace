// Client-side Finance state. Seeded from src/data/finance.ts; mutations
// live only in memory for this session — swap for API calls later without
// touching the UI layer.
import { create } from "zustand";
import {
  invoices as seedInvoices,
  expenses as seedExpenses,
  type Invoice,
  type InvoiceStatus,
  type Expense,
  type ExpenseCategory,
  type ExpenseStatus,
} from "@/data/finance";
import { currentUser } from "@/mock";

type FinanceState = {
  invoices: Invoice[];
  addInvoice: (client: string, total: number) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  expenses: Expense[];
  addExpense: (vendor: string, amount: number, category?: ExpenseCategory) => void;
  setExpenseStatus: (id: string, status: ExpenseStatus) => void;
};

const nextInvoiceNumber = (invoices: Invoice[]) => {
  const max = invoices.reduce((m, inv) => {
    const n = Number(inv.number.replace("INV-", ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 1000);
  return `INV-${max + 1}`;
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  invoices: seedInvoices,
  addInvoice: (client, total) => {
    // InvoiceFormDialog (existing, reused as-is) only reports back the
    // client and the subtotal it computed from the line items the user
    // entered — it doesn't forward the itemized lines themselves. A single
    // line item carrying the real total is the most faithful record we can
    // build from that; the total is always correct even though the
    // description is a placeholder.
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: nextInvoiceNumber(get().invoices),
      client,
      issueDate: today,
      dueDate: due,
      status: "draft",
      taxRate: 0,
      notes: "",
      lineItems: [
        { id: `li-${Date.now()}`, description: "Professional services", quantity: 1, rate: total },
      ],
    };
    set((s) => ({ invoices: [invoice, ...s.invoices] }));
  },
  setInvoiceStatus: (id, status) =>
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status,
              ...(status === "paid" ? { paidOn: new Date().toISOString().slice(0, 10) } : {}),
            }
          : inv,
      ),
    })),
  expenses: seedExpenses,
  addExpense: (vendor, amount, category = "Software") => {
    const expense: Expense = {
      id: `ex-${Date.now()}`,
      vendor,
      category,
      date: new Date().toISOString().slice(0, 10),
      amount,
      status: "pending",
      submittedBy: currentUser.name,
    };
    set((s) => ({ expenses: [expense, ...s.expenses] }));
  },
  setExpenseStatus: (id, status) =>
    set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, status } : e)) })),
}));
