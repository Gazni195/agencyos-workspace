// Client-side Finance state. Seeded from src/data/finance.ts; mutations
// live only in memory for this session — swap for API calls later without
// touching the UI layer.
import { create } from "zustand";
import {
  invoices as seedInvoices,
  expenses as seedExpenses,
  invoiceTotal,
  type Invoice,
  type InvoiceStatus,
  type Expense,
  type ExpenseCategory,
  type ExpenseStatus,
} from "@/data/finance";
import { money } from "@/data/agency";
import { getCurrentUser } from "@/hooks/useCurrentUser";
import { useActivityStore } from "./activityStore";
import { useInboxStore } from "./inboxStore";

type FinanceState = {
  invoices: Invoice[];
  addInvoice: (clientId: string, total: number) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  expenses: Expense[];
  addExpense: (
    vendor: string,
    amount: number,
    category?: ExpenseCategory,
    clientId?: string,
    projectId?: string,
  ) => void;
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
  addInvoice: (clientId, total) => {
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
      clientId,
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
    useActivityStore.getState().addClientActivity({
      id: `ca-${clientId}-invoice-${invoice.id}`,
      clientId,
      type: "invoice",
      title: `Invoice ${invoice.number} issued`,
      description: `${money(invoiceTotal(invoice))} billed.`,
      who: getCurrentUser().name,
      when: today,
    });
  },
  setInvoiceStatus: (id, status) => {
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
    }));
    if (status === "paid") {
      const invoice = get().invoices.find((inv) => inv.id === id);
      if (invoice) {
        useInboxStore.getState().addNotification({
          id: `nt-invoice-paid-${id}`,
          icon: "system",
          title: "Invoice paid",
          detail: `${invoice.number} (${money(invoiceTotal(invoice))}) was marked paid.`,
          time: "Just now",
          read: false,
        });
      }
    }
  },
  expenses: seedExpenses,
  addExpense: (vendor, amount, category = "Software", clientId, projectId) => {
    const submittedBy = getCurrentUser().name;
    const expense: Expense = {
      id: `ex-${Date.now()}`,
      vendor,
      category,
      date: new Date().toISOString().slice(0, 10),
      amount,
      status: "pending",
      submittedBy,
      ...(clientId ? { clientId } : {}),
      ...(projectId ? { projectId } : {}),
    };
    set((s) => ({ expenses: [expense, ...s.expenses] }));
    useInboxStore.getState().addNotification({
      id: `nt-expense-${expense.id}`,
      icon: "approval",
      title: "Expense needs approval",
      detail: `${vendor} — ${money(amount)} submitted by ${submittedBy}.`,
      time: "Just now",
      read: false,
    });
  },
  setExpenseStatus: (id, status) => {
    set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, status } : e)) }));
    if (status === "approved" || status === "rejected") {
      const expense = get().expenses.find((e) => e.id === id);
      if (expense) {
        useInboxStore.getState().addNotification({
          id: `nt-expense-${id}-${status}`,
          icon: "approval",
          title: status === "approved" ? "Expense approved" : "Expense rejected",
          detail: `${expense.vendor} — ${money(expense.amount)} was ${status}.`,
          time: "Just now",
          read: false,
        });
      }
    }
  },
}));
