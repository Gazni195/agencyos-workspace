// Client-side HRMS state. Seeded from src/data/agency.ts. Mutations live
// only in memory for this session — swap for API calls later without
// touching the UI layer.
import { create } from "zustand";
import {
  leaveRequests as seedLeaveRequests,
  payroll as seedPayroll,
  timesheets as seedTimesheets,
  type LeaveRequest,
  type PayrollRun,
  type TimesheetEntry,
} from "@/data/agency";

type HrState = {
  leaveRequests: LeaveRequest[];
  setLeaveStatus: (id: string, status: LeaveRequest["status"]) => void;
  payroll: PayrollRun[];
  setPayrollStatus: (id: string, status: PayrollRun["status"]) => void;
  timesheets: TimesheetEntry[];
  addTimesheet: (entry: TimesheetEntry) => void;
  setTimesheetStatus: (id: string, status: TimesheetEntry["status"]) => void;
};

export const useHrStore = create<HrState>((set) => ({
  leaveRequests: seedLeaveRequests,
  setLeaveStatus: (id, status) =>
    set((s) => ({
      leaveRequests: s.leaveRequests.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
  payroll: seedPayroll,
  setPayrollStatus: (id, status) =>
    set((s) => ({ payroll: s.payroll.map((p) => (p.id === id ? { ...p, status } : p)) })),
  timesheets: seedTimesheets,
  addTimesheet: (entry) => set((s) => ({ timesheets: [entry, ...s.timesheets] })),
  setTimesheetStatus: (id, status) =>
    set((s) => ({
      timesheets: s.timesheets.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
}));
