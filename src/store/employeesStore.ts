// Client-side Employees state, backed by Supabase's `employees` table (see
// supabase/migrations/0006_employees.sql). Every other module (task/project
// assignment, dashboard, reports) reads employees through this store so a
// newly-added employee is immediately visible everywhere, not just on the
// Directory page.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { type Employee } from "@/data/agency";
import { useInboxStore } from "./inboxStore";

type EmployeeRow = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  employment_type: Employee["employmentType"];
  status: Employee["status"];
  manager: string;
  joined_on: string;
  salary: number;
  utilization: number;
  leave_balance: number;
  skills: string[];
  role_id: string;
};

function fromRow(row: EmployeeRow): Employee {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    role: row.role,
    department: row.department,
    email: row.email,
    phone: row.phone,
    location: row.location,
    employmentType: row.employment_type,
    status: row.status,
    manager: row.manager,
    joinedOn: row.joined_on,
    salary: row.salary,
    utilization: row.utilization,
    leaveBalance: row.leave_balance,
    skills: row.skills,
    roleId: row.role_id,
  };
}

function toRow(employee: Partial<Employee>) {
  const row: Record<string, unknown> = {};
  if (employee.name !== undefined) row["name"] = employee.name;
  if (employee.initials !== undefined) row["initials"] = employee.initials;
  if (employee.role !== undefined) row["role"] = employee.role;
  if (employee.department !== undefined) row["department"] = employee.department;
  if (employee.email !== undefined) row["email"] = employee.email;
  if (employee.phone !== undefined) row["phone"] = employee.phone;
  if (employee.location !== undefined) row["location"] = employee.location;
  if (employee.employmentType !== undefined) row["employment_type"] = employee.employmentType;
  if (employee.status !== undefined) row["status"] = employee.status;
  if (employee.manager !== undefined) row["manager"] = employee.manager;
  if (employee.joinedOn !== undefined) row["joined_on"] = employee.joinedOn;
  if (employee.salary !== undefined) row["salary"] = employee.salary;
  if (employee.utilization !== undefined) row["utilization"] = employee.utilization;
  if (employee.leaveBalance !== undefined) row["leave_balance"] = employee.leaveBalance;
  if (employee.skills !== undefined) row["skills"] = employee.skills;
  if (employee.roleId !== undefined) row["role_id"] = employee.roleId;
  return row;
}

export type NewEmployeeInput = Omit<Employee, "id">;

type EmployeesState = {
  employees: Employee[];
  loaded: boolean;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: NewEmployeeInput) => Promise<Employee | null>;
  updateEmployee: (id: string, patch: Partial<Employee>) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
};

export const useEmployeesStore = create<EmployeesState>((set) => ({
  employees: [],
  loaded: false,
  fetchEmployees: async () => {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load employees", error);
      set({ loaded: true });
      return;
    }
    set({ employees: (data as EmployeeRow[]).map(fromRow), loaded: true });
  },
  addEmployee: async (employee) => {
    const { data, error } = await supabase
      .from("employees")
      .insert(toRow(employee))
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create employee", error);
      return null;
    }
    const created = fromRow(data as EmployeeRow);
    set((s) => ({ employees: [created, ...s.employees] }));
    useInboxStore.getState().addNotification({
      id: `nt-employee-${created.id}`,
      icon: "system",
      title: "New employee added",
      detail: `${created.name} joined as ${created.role}.`,
      time: "Just now",
      read: false,
    });
    return created;
  },
  updateEmployee: async (id, patch) => {
    const { error } = await supabase.from("employees").update(toRow(patch)).eq("id", id);
    if (error) {
      console.error("Failed to update employee", error);
      return;
    }
    set((s) => ({
      employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  },
  removeEmployee: async (id) => {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete employee", error);
      return;
    }
    set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }));
  },
}));
