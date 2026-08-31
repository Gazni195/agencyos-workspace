// Client-side Employees state. Seeded from src/data/agency.ts; mutations
// live only in memory for this session. Every other module (task/project
// assignment, dashboard, reports) reads employees through this store so a
// newly-added employee is immediately visible everywhere, not just on the
// Directory page.
import { create } from "zustand";
import { employees as seedEmployees, type Employee } from "@/data/agency";

type EmployeesState = {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
};

export const useEmployeesStore = create<EmployeesState>((set) => ({
  employees: seedEmployees,
  addEmployee: (employee) => set((s) => ({ employees: [employee, ...s.employees] })),
  updateEmployee: (id, patch) =>
    set((s) => ({
      employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),
  removeEmployee: (id) => set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),
}));
