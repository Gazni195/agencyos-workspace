// Data layer for AgencyOS.
// Structured to mirror future Supabase/ERPNext tables — swap these arrays for queries later.
// Record arrays start empty (no seeded sample data); a few small arrays are
// kept as fixed configuration/vocabulary (e.g. `departments`) since the UI
// needs them to render its structure (filters, dropdowns) even with zero
// records.

export type EmployeeStatus = "active" | "on-leave" | "probation" | "offboarding";

export type Employee = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: "Creative" | "Media" | "Strategy" | "Engineering" | "Operations" | "Sales";
  email: string;
  phone: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  status: EmployeeStatus;
  manager: string;
  joinedOn: string;
  salary: number;
  utilization: number;
  leaveBalance: number;
  skills: string[];
};

export const employees: Employee[] = [];

export const departments = [
  "Creative",
  "Media",
  "Strategy",
  "Engineering",
  "Operations",
  "Sales",
] as const;

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  status: "present" | "late" | "remote" | "absent";
};

export const attendance: AttendanceRecord[] = [];

export const attendanceTrend: { day: string; present: number; remote: number; absent: number }[] =
  [];

export type LeaveRequest = {
  id: string;
  employeeId: string;
  type: "Annual" | "Sick" | "Parental" | "Unpaid" | "Study";
  from: string;
  to: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
};

export const leaveRequests: LeaveRequest[] = [];

export type PayrollRun = {
  id: string;
  employeeId: string;
  period: string;
  base: number;
  bonus: number;
  deductions: number;
  net: number;
  status: "paid" | "processing" | "on-hold";
};

export const payroll: PayrollRun[] = employees.map((e, i) => {
  const base = Math.round(e.salary / 12);
  const bonus = i % 3 === 0 ? 1200 : i % 4 === 0 ? 800 : 0;
  const deductions = Math.round(base * 0.24);
  return {
    id: `pay-${e.id}`,
    employeeId: e.id,
    period: "August 2026",
    base,
    bonus,
    deductions,
    net: base + bonus - deductions,
    status: e.status === "offboarding" ? "on-hold" : i % 5 === 0 ? "processing" : "paid",
  };
});

export const payrollTrend: { month: string; cost: number }[] = [];

export type PerformanceReview = {
  id: string;
  employeeId: string;
  cycle: string;
  score: number;
  goalsMet: number;
  goalsTotal: number;
  reviewer: string;
  status: "completed" | "in-review" | "scheduled";
};

export const performance: PerformanceReview[] = [];

export const performanceByDept: { department: string; score: number }[] = [];

export type EmployeeDocument = {
  id: string;
  employeeId: string;
  name: string;
  category: "Contract" | "ID" | "Policy" | "Certificate" | "Payslip";
  size: string;
  uploadedOn: string;
  expiresOn?: string;
  status: "valid" | "expiring" | "expired";
};

export const documents: EmployeeDocument[] = [];

export type TimesheetEntry = {
  id: string;
  employeeId: string;
  client: string;
  project: string;
  task: string;
  date: string;
  hours: number;
  billable: boolean;
  status: "draft" | "submitted" | "approved";
};

export const timesheets: TimesheetEntry[] = [];

export const revenueTrend: { month: string; revenue: number; costs: number }[] = [];

export const pipeline: { stage: string; value: number }[] = [];

export const clients: {
  id: string;
  name: string;
  industry: string;
  owner: string;
  mrr: number;
  health: string;
  projects: number;
}[] = [];

export const projects: {
  id: string;
  name: string;
  client: string;
  lead: string;
  progress: number;
  budget: number;
  status: string;
  due: string;
}[] = [];

export const tasks: {
  id: string;
  title: string;
  project: string;
  assignee: string;
  due: string;
  priority: string;
  status: string;
}[] = [];

export const leads: {
  id: string;
  company: string;
  contact: string;
  stage: string;
  value: number;
  owner: string;
  source: string;
}[] = [];

export const assets: {
  id: string;
  name: string;
  tag: string;
  assignedTo: string;
  category: string;
  status: string;
}[] = [];

export const inbox: {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}[] = [];

export const activityFeed: { id: string; who: string; what: string; when: string }[] = [];

export const employeeById = (id: string) => employees.find((e) => e.id === id);
export const employeeName = (id: string) => employeeById(id)?.name ?? "Unknown";
export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
