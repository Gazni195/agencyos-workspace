// Executive dashboard aggregation. Frontend-only for now — every value is
// derived from the local mock data layer (src/data), but for anything that
// can be created/edited at runtime (clients, leads, projects, tasks,
// invoices, expenses, leave requests) this reads the live Zustand store via
// getState() rather than the static seed export, so newly-created records
// show up immediately. getDashboardKpis()/getPendingApprovals() are plain
// functions (not hooks) called fresh on every render of the dashboard, so a
// getState() snapshot here is always current. Swapping to ERPNext later
// means replacing these reads with API calls; the shape returned to
// components stays the same, so no UI refactor is required.
import { attendance, employeeName, employees, money, revenueTrend } from "@/data/agency";
import { invoiceTotal } from "@/data/finance";
import { useClientsStore } from "@/store/clientsStore";
import { useLeadsStore } from "@/store/leadsStore";
import { useProjectsStore } from "@/store/projectsStore";
import { useTasksStore } from "@/store/tasksStore";
import { useFinanceStore } from "@/store/financeStore";
import { useHrStore } from "@/store/hrStore";

export type DashboardKpi = {
  id: string;
  label: string;
  value: string;
  delta?: number;
  hint: string;
  to: string;
};

function pctChange(curr: number, prev: number) {
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

export function getDashboardKpis(): DashboardKpi[] {
  const clients = useClientsStore.getState().clients;
  const leads = useLeadsStore.getState().leads;
  const projects = useProjectsStore.getState().projects;
  const tasks = useTasksStore.getState().tasks;
  const invoices = useFinanceStore.getState().invoices;

  const lastMonth = revenueTrend[revenueTrend.length - 1];
  const prevMonth = revenueTrend[revenueTrend.length - 2];
  const revenue = lastMonth?.revenue ?? 0;
  const revenueDelta = lastMonth && prevMonth ? pctChange(lastMonth.revenue, prevMonth.revenue) : 0;

  const atRiskClients = clients.filter((c) => c.health !== "healthy").length;
  const onTrackProjects = projects.filter((p) => p.status === "on-track").length;
  const onLeaveEmployees = employees.filter(
    (e) => e.status === "on-leave" || e.status === "probation",
  ).length;

  const presentToday = attendance.filter(
    (a) => a.status === "present" || a.status === "remote",
  ).length;
  const attendanceRate = attendance.length
    ? Math.round((presentToday / attendance.length) * 100)
    : 0;
  const remoteToday = attendance.filter((a) => a.status === "remote").length;
  const lateToday = attendance.filter((a) => a.status === "late").length;

  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
  const leadsValue = leads.reduce((sum, l) => sum + l.value, 0);

  const receivables = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + invoiceTotal(inv), 0);
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

  return [
    {
      id: "revenue-mtd",
      label: "Revenue MTD",
      value: money(revenue),
      delta: revenueDelta,
      hint: "vs. last month",
      to: "/finance",
    },
    {
      id: "active-clients",
      label: "Active Clients",
      value: String(clients.length),
      hint: `${atRiskClients} need attention`,
      to: "/clients",
    },
    {
      id: "active-projects",
      label: "Active Projects",
      value: String(projects.length),
      hint: `${onTrackProjects} on track`,
      to: "/projects",
    },
    {
      id: "employees",
      label: "Employees",
      value: String(employees.length),
      hint: `${onLeaveEmployees} on leave`,
      to: "/employees",
    },
    {
      id: "attendance-today",
      label: "Attendance Today",
      value: `${attendanceRate}%`,
      hint: `${remoteToday} remote · ${lateToday} late`,
      to: "/employees/attendance",
    },
    {
      id: "pending-tasks",
      label: "Pending Tasks",
      value: String(tasks.length),
      hint: `${highPriorityTasks} high priority`,
      to: "/tasks",
    },
    {
      id: "open-leads",
      label: "Open Leads",
      value: String(leads.length),
      hint: `${money(leadsValue)} weighted`,
      to: "/leads",
    },
    {
      id: "receivables",
      label: "Receivables",
      value: money(receivables),
      hint: `${overdueCount} overdue`,
      to: "/finance",
    },
  ];
}

export type PendingApproval = {
  id: string;
  kind: "leave" | "expense";
  title: string;
  meta: string;
  amount?: string;
  to: string;
};

export function getPendingApprovals(): PendingApproval[] {
  const leaveRequests = useHrStore.getState().leaveRequests;
  const expenses = useFinanceStore.getState().expenses;

  const leaveApprovals: PendingApproval[] = leaveRequests
    .filter((lr) => lr.status === "pending")
    .map((lr) => ({
      id: lr.id,
      kind: "leave",
      title: `${employeeName(lr.employeeId)} — ${lr.type} leave`,
      meta: `${lr.days} day${lr.days === 1 ? "" : "s"} · ${lr.from} to ${lr.to}`,
      to: "/employees/leave",
    }));

  const expenseApprovals: PendingApproval[] = expenses
    .filter((e) => e.status === "pending")
    .map((e) => ({
      id: e.id,
      kind: "expense",
      title: `${e.vendor} — ${e.category}`,
      meta: `Submitted by ${e.submittedBy}`,
      amount: money(e.amount),
      to: "/finance/expenses",
    }));

  return [...leaveApprovals, ...expenseApprovals];
}
