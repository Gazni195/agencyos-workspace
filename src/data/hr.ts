// Additional HR mock data for the Employees module. Reuses core arrays from @/data/agency.ts.
import { employees, type Employee } from "@/data/agency.ts";

export function employeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export const designations = [
  "Creative Director",
  "Senior Media Buyer",
  "Account Strategist",
  "Frontend Engineer",
  "Backend Engineer",
  "Head of Media",
  "Motion Designer",
  "Operations Manager",
  "New Business Lead",
  "Content Strategist",
];

export type LeaveType = {
  name: string;
  annualAllowance: number;
  carryOver: boolean;
  color: string;
};

export const leaveTypes: LeaveType[] = [
  { name: "Annual", annualAllowance: 20, carryOver: true, color: "chart-1" },
  { name: "Sick", annualAllowance: 10, carryOver: false, color: "chart-2" },
  { name: "Parental", annualAllowance: 90, carryOver: false, color: "chart-3" },
  { name: "Unpaid", annualAllowance: 0, carryOver: false, color: "chart-4" },
  { name: "Study", annualAllowance: 5, carryOver: false, color: "chart-5" },
];

export const workingHours = {
  standardStart: "09:00",
  standardEnd: "18:00",
  breakMinutes: 60,
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

export const attendancePolicies = [
  { id: "pol-1", label: "Auto-flag late check-in after grace period", description: "Marks an employee late if they check in more than 15 minutes after start time.", enabled: true },
  { id: "pol-2", label: "Allow remote check-in", description: "Employees can clock in from outside office geofence.", enabled: true },
  { id: "pol-3", label: "Require manager approval for overtime", description: "Any day over 9 hours needs manager sign-off.", enabled: false },
  { id: "pol-4", label: "Auto clock-out after 12 hours", description: "Prevents forgotten sessions from running indefinitely.", enabled: true },
];

export const approvalWorkflows = [
  { id: "wf-1", label: "Leave requests", approver: "Direct manager" },
  { id: "wf-2", label: "Timesheet submissions", approver: "Project lead" },
  { id: "wf-3", label: "Payroll adjustments", approver: "Head of Operations" },
  { id: "wf-4", label: "Expense reimbursements", approver: "Finance team" },
];

export type EmployeeGoal = {
  id: string;
  employeeId: string;
  title: string;
  progress: number;
  dueDate: string;
};

export const employeeGoals: EmployeeGoal[] = [
  { id: "gl-1", employeeId: "emp-1001", title: "Launch refreshed brand guideline system", progress: 90, dueDate: "2026-09-15" },
  { id: "gl-2", employeeId: "emp-1001", title: "Mentor two junior art directors", progress: 60, dueDate: "2026-11-01" },
  { id: "gl-3", employeeId: "emp-1002", title: "Improve paid social ROAS by 15%", progress: 72, dueDate: "2026-10-01" },
  { id: "gl-4", employeeId: "emp-1004", title: "Ship component library v2", progress: 45, dueDate: "2026-10-20" },
  { id: "gl-5", employeeId: "emp-1006", title: "Complete motion design certification", progress: 30, dueDate: "2026-12-01" },
  { id: "gl-6", employeeId: "emp-1007", title: "Reduce resourcing conflicts by 20%", progress: 80, dueDate: "2026-09-30" },
];

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

export const departmentOptions = ["Creative", "Media", "Strategy", "Engineering", "Operations", "Sales"] as const;

export const timesheetWeeklyHours = [
  { week: "W1", billable: 156, nonBillable: 42 },
  { week: "W2", billable: 168, nonBillable: 38 },
  { week: "W3", billable: 149, nonBillable: 51 },
  { week: "W4", billable: 172, nonBillable: 33 },
];
