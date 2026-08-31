// Frontend-only mock data for the app shell (header notifications,
// global search) and current-user identity.
// Replace these with API/ERPNext calls in a later phase.

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  when: string;
  unread: boolean;
};

export const headerNotifications: NotificationItem[] = [];

export type SearchEntry = { label: string; group: string; to: string };

export const globalSearchIndex: SearchEntry[] = [
  { label: "Dashboard", group: "Navigation", to: "/" },
  { label: "Clients", group: "Navigation", to: "/clients" },
  { label: "Leads", group: "Navigation", to: "/leads" },
  { label: "Projects", group: "Navigation", to: "/projects" },
  { label: "Tasks", group: "Navigation", to: "/tasks" },
  { label: "Assets", group: "Navigation", to: "/assets" },
  { label: "Task Board", group: "Tasks", to: "/tasks/board" },
  { label: "Task List", group: "Tasks", to: "/tasks/list" },
  { label: "Task Calendar", group: "Tasks", to: "/tasks/calendar" },
  { label: "Operations Overview", group: "Operations", to: "/operations" },
  { label: "Team Workload", group: "Operations", to: "/operations/workload" },
  { label: "Clients Waiting", group: "Operations", to: "/operations/clients" },
  { label: "Deliverables", group: "Operations", to: "/operations/deliverables" },
  { label: "Employee Directory", group: "Employees", to: "/employees" },
  { label: "Attendance", group: "Employees", to: "/employees/attendance" },
  { label: "Leave Management", group: "Employees", to: "/employees/leave" },
  { label: "Payroll", group: "Employees", to: "/employees/payroll" },
  { label: "Performance", group: "Employees", to: "/employees/performance" },
  { label: "Employee Documents", group: "Employees", to: "/employees/documents" },
  { label: "Timesheets", group: "Employees", to: "/employees/timesheets" },
  { label: "Employee Settings", group: "Employees", to: "/employees/settings" },
  { label: "Revenue Dashboard", group: "Finance", to: "/finance" },
  { label: "Invoices", group: "Finance", to: "/finance/invoices" },
  { label: "Expenses", group: "Finance", to: "/finance/expenses" },
  { label: "Payments", group: "Finance", to: "/finance/payments" },
  { label: "Revenue Report", group: "Reports", to: "/reports" },
  { label: "Project Reports", group: "Reports", to: "/reports/projects" },
  { label: "Employee Reports", group: "Reports", to: "/reports/employees" },
  { label: "Lead Reports", group: "Reports", to: "/reports/leads" },
  { label: "Finance Reports", group: "Reports", to: "/reports/finance" },
  { label: "Messages", group: "Inbox", to: "/inbox" },
  { label: "Notifications", group: "Inbox", to: "/inbox/notifications" },
  { label: "Organization", group: "Settings", to: "/settings" },
  { label: "Roles & Permissions", group: "Settings", to: "/settings/roles" },
  { label: "Integrations", group: "Settings", to: "/settings/integrations" },
  { label: "Workflows", group: "Settings", to: "/settings/workflows" },
  { label: "Notification Rules", group: "Settings", to: "/settings/notifications" },
];

export const currentUser = {
  name: "Daniel Reyes",
  initials: "DR",
  role: "Owner",
  email: "daniel@agencyos.co",
};
