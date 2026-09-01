// Types & seed data for the Employees module (includes HR: attendance,
// leave, payroll, performance, documents, timesheets).
export type EmployeeStatus = "active" | "on-leave" | "probation" | "offboarding";

export type Employee = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
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
  // FK into settings/types.ts's rolesSeed / useSettingsStore roles — the
  // permission role this employee signs in as (see usePermissions,
  // shared/frontend/utils/identity.ts). Distinct from `role` above, which
  // is just a job title/designation string and has no bearing on access
  // control.
  roleId: string;
};

export const employees: Employee[] = [];

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
  type: string;
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
  projectId: string;
  taskId?: string;
  deliverableId?: string;
  date: string;
  hours: number;
  billable: boolean;
  status: "draft" | "submitted" | "approved";
};

export const timesheets: TimesheetEntry[] = [];

export type EmployeeGoal = {
  id: string;
  employeeId: string;
  title: string;
  progress: number;
  dueDate: string;
};

export const employeeGoals: EmployeeGoal[] = [];

// Attendance status calendar for the current month, keyed by day number, for a subset of employees.
export type DayStatus = "present" | "late" | "remote" | "absent" | "weekend" | "leave" | "none";

export function generateMonthCalendar(seed: number, daysInMonth = 30): DayStatus[] {
  const pattern: DayStatus[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = (day + seed) % 7;
    if (weekday === 0 || weekday === 6) {
      pattern.push("weekend");
      continue;
    }
    const roll = (day * 7 + seed * 13) % 20;
    if (roll < 13) pattern.push("present");
    else if (roll < 16) pattern.push("remote");
    else if (roll < 18) pattern.push("late");
    else if (roll < 19) pattern.push("leave");
    else pattern.push("absent");
  }
  return pattern;
}

export const monthLabel = "August 2026";
