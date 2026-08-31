// Additional HR mock data for the Employees module. Reuses core arrays from @/data/agency.ts.
import { employees, type Employee } from "@/data/agency.ts";

export function employeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

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

export const timesheetWeeklyHours: { week: string; billable: number; nonBillable: number }[] = [];
