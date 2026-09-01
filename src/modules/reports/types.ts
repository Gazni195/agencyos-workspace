// Types & seed data for the Reports module.
//
// attendanceTrend/departmentAttendance are deliberately left frozen: they'd
// derive from modules/employees's `attendance` array, which has no
// creation path anywhere in the app (no clock-in/clock-out or attendance
// entry flow exists), unlike invoices/expenses/clients/projects (see
// financeReportsService.ts) which are all created through real UI. Wiring
// these to "live" data with nothing that can ever populate it would just be
// the same frozen-data bug in a new shape, so the Reports > Employees
// attendance chart stays on this permanently-empty seed rather than
// pretending to be live.
export const attendanceTrend: { week: string; present: number; late: number; absent: number }[] =
  [];

export const departmentAttendance: {
  department: string;
  attendanceRate: number;
  avgHours: number;
  lateArrivals: number;
}[] = [];
