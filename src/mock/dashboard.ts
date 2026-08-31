// Frontend-only mock data for the executive dashboard.
// Replace these arrays with API/ERPNext calls in a later phase.

export type KpiId =
  | "revenue-mtd"
  | "active-clients"
  | "active-projects"
  | "employees"
  | "attendance-today"
  | "pending-tasks"
  | "open-leads"
  | "receivables";

export type DashboardKpi = {
  id: KpiId;
  label: string;
  value: string;
  delta: number;
  hint: string;
  to: string;
};

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "revenue-mtd",
    label: "Revenue MTD",
    value: "$412,800",
    delta: 8.4,
    hint: "vs. last month",
    to: "/finance",
  },
  {
    id: "active-clients",
    label: "Active Clients",
    value: "24",
    delta: 4.2,
    hint: "3 in onboarding",
    to: "/clients",
  },
  {
    id: "active-projects",
    label: "Active Projects",
    value: "18",
    delta: 2.1,
    hint: "5 launching this month",
    to: "/projects",
  },
  {
    id: "employees",
    label: "Employees",
    value: "68",
    delta: 5.6,
    hint: "4 open roles",
    to: "/employees",
  },
  {
    id: "attendance-today",
    label: "Attendance Today",
    value: "92%",
    delta: -1.8,
    hint: "6 remote · 2 late",
    to: "/employees/attendance",
  },
  {
    id: "pending-tasks",
    label: "Pending Tasks",
    value: "137",
    delta: -6.3,
    hint: "22 due this week",
    to: "/tasks",
  },
  {
    id: "open-leads",
    label: "Open Leads",
    value: "31",
    delta: 12.9,
    hint: "$740k weighted",
    to: "/leads",
  },
  {
    id: "receivables",
    label: "Receivables",
    value: "$186,400",
    delta: -3.4,
    hint: "$42k over 60 days",
    to: "/finance",
  },
];

export const revenueTrendMock = [
  { month: "Mar", revenue: 318000, costs: 214000, target: 300000 },
  { month: "Apr", revenue: 342000, costs: 221000, target: 320000 },
  { month: "May", revenue: 361000, costs: 233000, target: 340000 },
  { month: "Jun", revenue: 355000, costs: 240000, target: 355000 },
  { month: "Jul", revenue: 388000, costs: 246000, target: 370000 },
  { month: "Aug", revenue: 412800, costs: 258000, target: 390000 },
];

export const leadFunnel = [
  { stage: "New", count: 68, value: 1240000 },
  { stage: "Contacted", count: 52, value: 1080000 },
  { stage: "Qualified", count: 34, value: 860000 },
  { stage: "Proposal", count: 21, value: 620000 },
  { stage: "Negotiation", count: 12, value: 410000 },
  { stage: "Won", count: 7, value: 268000 },
];

export const projectStatusMock = [
  { status: "on-track", count: 11 },
  { status: "at-risk", count: 4 },
  { status: "delayed", count: 2 },
  { status: "completed", count: 6 },
];

export const teamUtilization = [
  { team: "Creative", billable: 78, internal: 12, capacity: 100 },
  { team: "Media", billable: 86, internal: 8, capacity: 100 },
  { team: "Strategy", billable: 71, internal: 18, capacity: 100 },
  { team: "Engineering", billable: 82, internal: 11, capacity: 100 },
  { team: "Operations", billable: 58, internal: 30, capacity: 100 },
];

export const attendanceToday = {
  present: 51,
  remote: 9,
  late: 4,
  absent: 4,
};

export const attendanceWeek = [
  { day: "Mon", present: 62, absent: 6 },
  { day: "Tue", present: 64, absent: 4 },
  { day: "Wed", present: 60, absent: 8 },
  { day: "Thu", present: 63, absent: 5 },
  { day: "Fri", present: 61, absent: 7 },
];

export type ActivityItem = {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  when: string;
  tone: "primary" | "success" | "warning" | "info";
};

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    actor: "Priya Raman",
    initials: "PR",
    action: "moved lead",
    target: "Northwind Retail → Negotiation",
    when: "12m ago",
    tone: "primary",
  },
  {
    id: "a2",
    actor: "Marcus Hale",
    initials: "MH",
    action: "approved invoice",
    target: "INV-2041 · $38,500",
    when: "45m ago",
    tone: "success",
  },
  {
    id: "a3",
    actor: "Dana Whitfield",
    initials: "DW",
    action: "flagged project",
    target: "Vertex Rebrand — at risk",
    when: "1h ago",
    tone: "warning",
  },
  {
    id: "a4",
    actor: "Sam Okoye",
    initials: "SO",
    action: "submitted timesheet",
    target: "Week 35 · 41.5 hrs",
    when: "2h ago",
    tone: "info",
  },
  {
    id: "a5",
    actor: "Lena Fischer",
    initials: "LF",
    action: "closed 6 tasks on",
    target: "Helios Q3 Campaign",
    when: "3h ago",
    tone: "success",
  },
  {
    id: "a6",
    actor: "Tomas Ruiz",
    initials: "TR",
    action: "uploaded assets to",
    target: "Brand Library / Summer 26",
    when: "5h ago",
    tone: "info",
  },
];

export type UpcomingItem = {
  id: string;
  kind: "task" | "deadline" | "approval";
  title: string;
  meta: string;
  due: string;
  priority: "high" | "medium" | "low";
  to: string;
};

export const upcomingItems: UpcomingItem[] = [
  {
    id: "u1",
    kind: "approval",
    title: "Leave request — Sam Okoye",
    meta: "4 days · Annual leave",
    due: "Today",
    priority: "high",
    to: "/employees/leave",
  },
  {
    id: "u2",
    kind: "deadline",
    title: "Helios Q3 Campaign launch",
    meta: "Creative + Media",
    due: "Tomorrow",
    priority: "high",
    to: "/projects",
  },
  {
    id: "u3",
    kind: "task",
    title: "Finalise Northwind proposal deck",
    meta: "Assigned to Priya Raman",
    due: "Sep 1",
    priority: "medium",
    to: "/tasks",
  },
  {
    id: "u4",
    kind: "approval",
    title: "Invoice INV-2048 · $24,300",
    meta: "Awaiting finance sign-off",
    due: "Sep 2",
    priority: "medium",
    to: "/finance",
  },
  {
    id: "u5",
    kind: "deadline",
    title: "Vertex Rebrand milestone 3",
    meta: "Design system handoff",
    due: "Sep 4",
    priority: "high",
    to: "/projects",
  },
  {
    id: "u6",
    kind: "task",
    title: "Quarterly performance reviews",
    meta: "12 of 68 completed",
    due: "Sep 8",
    priority: "low",
    to: "/employees/performance",
  },
];

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  when: string;
  unread: boolean;
};

export const headerNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Leave approval pending",
    body: "Sam Okoye requested 4 days of annual leave.",
    when: "10m",
    unread: true,
  },
  {
    id: "n2",
    title: "Invoice overdue",
    body: "INV-2019 for Vertex Labs is 12 days overdue.",
    when: "1h",
    unread: true,
  },
  {
    id: "n3",
    title: "New lead assigned",
    body: "Northwind Retail was assigned to you.",
    when: "3h",
    unread: true,
  },
  {
    id: "n4",
    title: "Timesheet reminder",
    body: "9 employees have not submitted week 35.",
    when: "Yesterday",
    unread: false,
  },
];

export type SearchEntry = { label: string; group: string; to: string };

export const globalSearchIndex: SearchEntry[] = [
  { label: "Dashboard", group: "Navigation", to: "/" },
  { label: "Clients", group: "Navigation", to: "/clients" },
  { label: "Leads", group: "Navigation", to: "/leads" },
  { label: "Projects", group: "Navigation", to: "/projects" },
  { label: "Tasks", group: "Navigation", to: "/tasks" },
  { label: "Employee Directory", group: "Employees", to: "/employees" },
  { label: "Attendance", group: "Employees", to: "/employees/attendance" },
  { label: "Leave Management", group: "Employees", to: "/employees/leave" },
  { label: "Payroll", group: "Employees", to: "/employees/payroll" },
  { label: "Performance", group: "Employees", to: "/employees/performance" },
  { label: "Employee Documents", group: "Employees", to: "/employees/documents" },
  { label: "Timesheets", group: "Employees", to: "/employees/timesheets" },
  { label: "Finance", group: "Navigation", to: "/finance" },
  { label: "Reports", group: "Navigation", to: "/reports" },
  { label: "Inbox", group: "Navigation", to: "/inbox" },
  { label: "Assets", group: "Navigation", to: "/assets" },
  { label: "Settings", group: "Navigation", to: "/settings" },
];

export const currentUser = {
  name: "Daniel Reyes",
  initials: "DR",
  role: "Owner",
  email: "daniel@agencyos.co",
};
