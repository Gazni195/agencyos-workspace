// Client-side Finance state, backed by Supabase's `invoices`,
// `invoice_line_items` and `expenses` tables (see
// supabase/migrations/0007_finance.sql). "Payments" (finance.payments.tsx)
// isn't its own table — it's invoices filtered to status = 'paid'.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import {
  invoiceTotal,
  type Invoice,
  type InvoiceLineItem,
  type InvoiceStatus,
  type Expense,
  type ExpenseCategory,
  type ExpenseStatus,
} from "@/data/finance";
import { money } from "@/data/agency";
import { getCurrentUser } from "@/hooks/useCurrentUser";
import { useActivityStore } from "./activityStore";
import { useInboxStore } from "./inboxStore";

type LineItemRow = { id: string; description: string; quantity: number; rate: number };
type InvoiceRow = {
  id: string;
  number: string;
  client_id: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  tax_rate: number;
  notes: string;
  paid_on: string | null;
  invoice_line_items: LineItemRow[];
};
type ExpenseRow = {
  id: string;
  vendor: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  status: ExpenseStatus;
  submitted_by: string;
  client_id: string | null;
  project_id: string | null;
};

function lineItemFromRow(row: LineItemRow): InvoiceLineItem {
  return { id: row.id, description: row.description, quantity: row.quantity, rate: row.rate };
}

function invoiceFromRow(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    status: row.status,
    taxRate: row.tax_rate,
    notes: row.notes,
    lineItems: (row.invoice_line_items ?? []).map(lineItemFromRow),
    ...(row.paid_on ? { paidOn: row.paid_on } : {}),
  };
}

function expenseFromRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    vendor: row.vendor,
    category: row.category,
    date: row.date,
    amount: row.amount,
    status: row.status,
    submittedBy: row.submitted_by,
    ...(row.client_id ? { clientId: row.client_id } : {}),
    ...(row.project_id ? { projectId: row.project_id } : {}),
  };
}

const INVOICE_SELECT = "*, invoice_line_items(id, description, quantity, rate)";

type FinanceState = {
  invoices: Invoice[];
  expenses: Expense[];
  loaded: boolean;
  fetchInvoices: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  addInvoice: (clientId: string, total: number) => Promise<void>;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  addExpense: (
    vendor: string,
    amount: number,
    category?: ExpenseCategory,
    clientId?: string,
    projectId?: string,
  ) => Promise<void>;
  setExpenseStatus: (id: string, status: ExpenseStatus) => Promise<void>;
};

const nextInvoiceNumber = (invoices: Invoice[]) => {
  const max = invoices.reduce((m, inv) => {
    const n = Number(inv.number.replace("INV-", ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 1000);
  return `INV-${max + 1}`;
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  invoices: [],
  expenses: [],
  loaded: false,
  fetchInvoices: async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select(INVOICE_SELECT)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load invoices", error);
      return;
    }
    set({ invoices: (data as InvoiceRow[]).map(invoiceFromRow) });
  },
  fetchExpenses: async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load expenses", error);
      return;
    }
    set({ expenses: (data as ExpenseRow[]).map(expenseFromRow) });
  },
  addInvoice: async (clientId, total) => {
    // InvoiceFormDialog (existing, reused as-is) only reports back the
    // client and the subtotal it computed from the line items the user
    // entered — it doesn't forward the itemized lines themselves. A single
    // line item carrying the real total is the most faithful record we can
    // build from that; the total is always correct even though the
    // description is a placeholder.
    const today = new Date().toISOString().slice(0, 10);
    const due = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("invoices")
      .insert({
        number: nextInvoiceNumber(get().invoices),
        client_id: clientId,
        issue_date: today,
        due_date: due,
        status: "draft",
        tax_rate: 0,
        notes: "",
      })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create invoice", error);
      return;
    }
    const invoiceId = (data as InvoiceRow).id;
    const { data: lineItem, error: lineItemError } = await supabase
      .from("invoice_line_items")
      .insert({
        invoice_id: invoiceId,
        description: "Professional services",
        quantity: 1,
        rate: total,
      })
      .select()
      .single();
    if (lineItemError || !lineItem) {
      console.error("Failed to create invoice line item", lineItemError);
      return;
    }
    const invoice = invoiceFromRow({
      ...(data as InvoiceRow),
      invoice_line_items: [lineItem as LineItemRow],
    });
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
  setInvoiceStatus: async (id, status) => {
    const paidOn = status === "paid" ? new Date().toISOString().slice(0, 10) : null;
    const { error } = await supabase
      .from("invoices")
      .update({ status, paid_on: paidOn })
      .eq("id", id);
    if (error) {
      console.error("Failed to update invoice status", error);
      return;
    }
    set((s) => ({
      invoices: s.invoices.map((inv) =>
        inv.id === id ? { ...inv, status, ...(paidOn ? { paidOn } : {}) } : inv,
      ),
    }));
    if (status === "paid") {
      const invoice = get().invoices.find((inv) => inv.id === id);
      if (invoice) {
        useInboxStore.getState().addNotification({
          icon: "system",
          title: "Invoice paid",
          detail: `${invoice.number} (${money(invoiceTotal(invoice))}) was marked paid.`,
        });
      }
    }
  },
  addExpense: async (vendor, amount, category = "Software", clientId, projectId) => {
    const submittedBy = getCurrentUser().name;
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        vendor,
        category,
        date: new Date().toISOString().slice(0, 10),
        amount,
        status: "pending",
        submitted_by: submittedBy,
        client_id: clientId ?? null,
        project_id: projectId ?? null,
      })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create expense", error);
      return;
    }
    const expense = expenseFromRow(data as ExpenseRow);
    set((s) => ({ expenses: [expense, ...s.expenses] }));
    useInboxStore.getState().addNotification({
      icon: "approval",
      title: "Expense needs approval",
      detail: `${vendor} — ${money(amount)} submitted by ${submittedBy}.`,
    });
  },
  setExpenseStatus: async (id, status) => {
    const { error } = await supabase.from("expenses").update({ status }).eq("id", id);
    if (error) {
      console.error("Failed to update expense status", error);
      return;
    }
    set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, status } : e)) }));
    if (status === "approved" || status === "rejected") {
      const expense = get().expenses.find((e) => e.id === id);
      if (expense) {
        useInboxStore.getState().addNotification({
          icon: "approval",
          title: status === "approved" ? "Expense approved" : "Expense rejected",
          detail: `${expense.vendor} — ${money(expense.amount)} was ${status}.`,
        });
      }
    }
  },
}));
