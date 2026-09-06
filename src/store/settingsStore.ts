// Client-side workspace-settings state.
//
// Departments, Designations, Client Packages, Leave Types, and Roles &
// Permissions are backed by Supabase (see
// supabase/migrations/0010_settings_catalogs.sql, and roles/role_permissions
// from 0001_roles_and_profiles.sql) — every consuming form (Employee
// create/edit, Client create/edit, Leave filters, the permission matrix
// itself) reads/writes real rows now.
//
// Integrations, Workflow approvers, Notification preferences and
// Attendance Policies stay in-memory: none of them back real behavior
// anywhere in the app yet (no actual third-party integration is wired to
// "Connected: true/false", and the other three are config toggles with no
// consuming logic), so persisting them would just move the same emptiness
// into Postgres.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useSessionStore } from "./sessionStore";
import {
  attendancePoliciesSeed,
  integrationsSeed,
  notificationEvents,
  permissionModules,
  workflowEvents,
  type AttendancePolicy,
  type ClientPackage,
  type Department,
  type Designation,
  type LeaveType,
  type PermissionAction,
  type PermissionMatrix,
  type Role,
} from "@/data/workspace";
import type { Integration } from "@/data/workspace";

type PermissionModule = (typeof permissionModules)[number];

const emptyModulePermissions = () =>
  Object.fromEntries(["view", "edit", "delete"].map((action) => [action, false])) as Record<
    PermissionAction,
    boolean
  >;

const emptyMatrixRow = () =>
  Object.fromEntries(
    permissionModules.map((mod) => [mod, emptyModulePermissions()]),
  ) as PermissionMatrix[string];

type DepartmentRow = { id: string; name: string; head: string };
type DesignationRow = { id: string; title: string; department: string; level: string };
type ClientPackageRow = {
  id: string;
  name: string;
  type: ClientPackage["type"];
  default_price: number;
};
type LeaveTypeRow = {
  id: string;
  name: string;
  annual_allowance: number;
  carry_over: boolean;
  color: string;
};
type RoleRow = { id: string; name: string; description: string };
type RolePermissionRow = {
  role_id: string;
  module: PermissionModule;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

export type NewDepartmentInput = Omit<Department, "id">;
export type NewDesignationInput = Omit<Designation, "id">;
export type NewClientPackageInput = Omit<ClientPackage, "id">;
export type NewLeaveTypeInput = Omit<LeaveType, "id">;
export type NewRoleInput = { name: string; description: string };

type SettingsState = {
  loaded: boolean;

  permissionMatrix: PermissionMatrix;
  togglePermission: (
    roleId: string,
    module: PermissionModule,
    action: PermissionAction,
  ) => Promise<void>;

  integrations: Integration[];
  toggleIntegration: (id: string) => void;
  workflowApprovers: Record<(typeof workflowEvents)[number], string>;
  setApprover: (event: (typeof workflowEvents)[number], approver: string) => void;
  notificationPrefs: Record<string, boolean>;
  toggleNotificationPref: (event: string) => void;

  departments: Department[];
  fetchDepartments: () => Promise<void>;
  addDepartment: (department: NewDepartmentInput) => Promise<Department | null>;
  updateDepartment: (id: string, patch: Partial<Department>) => Promise<void>;
  removeDepartment: (id: string) => Promise<void>;

  designations: Designation[];
  fetchDesignations: () => Promise<void>;
  addDesignation: (designation: NewDesignationInput) => Promise<Designation | null>;
  updateDesignation: (id: string, patch: Partial<Designation>) => Promise<void>;
  removeDesignation: (id: string) => Promise<void>;

  clientPackages: ClientPackage[];
  fetchClientPackages: () => Promise<void>;
  addClientPackage: (pkg: NewClientPackageInput) => Promise<ClientPackage | null>;
  updateClientPackage: (id: string, patch: Partial<ClientPackage>) => Promise<void>;
  removeClientPackage: (id: string) => Promise<void>;

  roles: Role[];
  fetchRoles: () => Promise<void>;
  addRole: (role: NewRoleInput) => Promise<Role | null>;
  updateRole: (id: string, patch: Partial<Role>) => Promise<void>;
  removeRole: (id: string) => Promise<{ ok: boolean; error?: string }>;

  leaveTypes: LeaveType[];
  fetchLeaveTypes: () => Promise<void>;
  addLeaveType: (leaveType: NewLeaveTypeInput) => Promise<LeaveType | null>;
  updateLeaveType: (id: string, patch: Partial<LeaveType>) => Promise<void>;
  removeLeaveType: (id: string) => Promise<void>;

  attendancePolicies: AttendancePolicy[];
  toggleAttendancePolicy: (id: string) => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  loaded: false,

  permissionMatrix: {},
  togglePermission: async (roleId, module, action) => {
    const current = get().permissionMatrix[roleId]?.[module] ?? emptyModulePermissions();
    const next = { ...current, [action]: !current[action] };
    set((s) => ({
      permissionMatrix: {
        ...s.permissionMatrix,
        [roleId]: { ...s.permissionMatrix[roleId], [module]: next },
      } as PermissionMatrix,
    }));
    const { error } = await supabase.from("role_permissions").upsert({
      role_id: roleId,
      module,
      can_view: next.view,
      can_edit: next.edit,
      can_delete: next.delete,
    });
    if (error) {
      console.error("Failed to update permission", error);
      return;
    }
    // Reflect immediately in the "Preview role" switcher's live access
    // checks, not just next login — sessionStore loaded its own snapshot of
    // role_permissions once at sign-in.
    useSessionStore.setState((s) => ({
      permissionsByRole: {
        ...s.permissionsByRole,
        [roleId]: { ...s.permissionsByRole[roleId], [module]: next },
      } as typeof s.permissionsByRole,
    }));
  },

  integrations: integrationsSeed,
  toggleIntegration: (id) =>
    set((s) => ({
      integrations: s.integrations.map((i) =>
        i.id === id ? { ...i, connected: !i.connected } : i,
      ),
    })),
  workflowApprovers: {
    "Leave Request": "Direct Manager",
    "Timesheet Submission": "Department Head",
    "Invoice Approval": "Finance Lead",
  },
  setApprover: (event, approver) =>
    set((s) => ({ workflowApprovers: { ...s.workflowApprovers, [event]: approver } })),
  notificationPrefs: Object.fromEntries(notificationEvents.map((e, i) => [e, i % 4 !== 3])),
  toggleNotificationPref: (event) =>
    set((s) => ({
      notificationPrefs: { ...s.notificationPrefs, [event]: !s.notificationPrefs[event] },
    })),

  departments: [],
  fetchDepartments: async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load departments", error);
      return;
    }
    set({
      departments: (data as DepartmentRow[]).map((d) => ({ id: d.id, name: d.name, head: d.head })),
    });
  },
  addDepartment: async (department) => {
    const { data, error } = await supabase
      .from("departments")
      .insert({ name: department.name, head: department.head })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create department", error);
      return null;
    }
    const row = data as DepartmentRow;
    const created: Department = { id: row.id, name: row.name, head: row.head };
    set((s) => ({ departments: [created, ...s.departments] }));
    return created;
  },
  updateDepartment: async (id, patch) => {
    const { error } = await supabase.from("departments").update(patch).eq("id", id);
    if (error) {
      console.error("Failed to update department", error);
      return;
    }
    set((s) => ({
      departments: s.departments.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  },
  removeDepartment: async (id) => {
    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete department", error);
      return;
    }
    set((s) => ({ departments: s.departments.filter((d) => d.id !== id) }));
  },

  designations: [],
  fetchDesignations: async () => {
    const { data, error } = await supabase
      .from("designations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load designations", error);
      return;
    }
    set({
      designations: (data as DesignationRow[]).map((d) => ({
        id: d.id,
        title: d.title,
        department: d.department,
        level: d.level,
      })),
    });
  },
  addDesignation: async (designation) => {
    const { data, error } = await supabase
      .from("designations")
      .insert({
        title: designation.title,
        department: designation.department,
        level: designation.level,
      })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create designation", error);
      return null;
    }
    const row = data as DesignationRow;
    const created: Designation = {
      id: row.id,
      title: row.title,
      department: row.department,
      level: row.level,
    };
    set((s) => ({ designations: [created, ...s.designations] }));
    return created;
  },
  updateDesignation: async (id, patch) => {
    const { error } = await supabase.from("designations").update(patch).eq("id", id);
    if (error) {
      console.error("Failed to update designation", error);
      return;
    }
    set((s) => ({
      designations: s.designations.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  },
  removeDesignation: async (id) => {
    const { error } = await supabase.from("designations").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete designation", error);
      return;
    }
    set((s) => ({ designations: s.designations.filter((d) => d.id !== id) }));
  },

  clientPackages: [],
  fetchClientPackages: async () => {
    const { data, error } = await supabase
      .from("client_packages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load client packages", error);
      return;
    }
    set({
      clientPackages: (data as ClientPackageRow[]).map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        defaultPrice: p.default_price,
      })),
    });
  },
  addClientPackage: async (pkg) => {
    const { data, error } = await supabase
      .from("client_packages")
      .insert({ name: pkg.name, type: pkg.type, default_price: pkg.defaultPrice })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create client package", error);
      return null;
    }
    const row = data as ClientPackageRow;
    const created: ClientPackage = {
      id: row.id,
      name: row.name,
      type: row.type,
      defaultPrice: row.default_price,
    };
    set((s) => ({ clientPackages: [created, ...s.clientPackages] }));
    return created;
  },
  updateClientPackage: async (id, patch) => {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row["name"] = patch.name;
    if (patch.type !== undefined) row["type"] = patch.type;
    if (patch.defaultPrice !== undefined) row["default_price"] = patch.defaultPrice;
    const { error } = await supabase.from("client_packages").update(row).eq("id", id);
    if (error) {
      console.error("Failed to update client package", error);
      return;
    }
    set((s) => ({
      clientPackages: s.clientPackages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  },
  removeClientPackage: async (id) => {
    const { error } = await supabase.from("client_packages").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete client package", error);
      return;
    }
    set((s) => ({ clientPackages: s.clientPackages.filter((p) => p.id !== id) }));
  },

  roles: [],
  fetchRoles: async () => {
    const [
      { data: roleRows, error: roleError },
      { data: permRows, error: permError },
      { data: profileRows, error: profileError },
    ] = await Promise.all([
      supabase.from("roles").select("*"),
      supabase.from("role_permissions").select("*"),
      supabase.from("profiles").select("role_id"),
    ]);
    if (roleError || !roleRows) {
      console.error("Failed to load roles", roleError);
      return;
    }
    if (permError) console.error("Failed to load role permissions", permError);
    if (profileError) console.error("Failed to load profile role counts", profileError);

    const userCounts = new Map<string, number>();
    for (const p of (profileRows ?? []) as { role_id: string }[]) {
      userCounts.set(p.role_id, (userCounts.get(p.role_id) ?? 0) + 1);
    }
    const roles: Role[] = (roleRows as RoleRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      users: userCounts.get(r.id) ?? 0,
    }));

    const matrix: PermissionMatrix = {};
    for (const r of roleRows as RoleRow[]) matrix[r.id] = emptyMatrixRow();
    for (const pr of (permRows ?? []) as RolePermissionRow[]) {
      const row = (matrix[pr.role_id] ??= emptyMatrixRow());
      row[pr.module] = {
        view: pr.can_view,
        edit: pr.can_edit,
        delete: pr.can_delete,
      };
    }
    set({ roles, permissionMatrix: matrix, loaded: true });
  },
  addRole: async (input) => {
    const slug =
      input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "role";
    const id = `role-${slug}-${Date.now().toString(36)}`;
    const { error } = await supabase
      .from("roles")
      .insert({ id, name: input.name, description: input.description });
    if (error) {
      console.error("Failed to create role", error);
      return null;
    }
    const permissionRows = permissionModules.map((mod) => ({
      role_id: id,
      module: mod,
      can_view: false,
      can_edit: false,
      can_delete: false,
    }));
    const { error: permError } = await supabase.from("role_permissions").insert(permissionRows);
    if (permError) console.error("Failed to seed role permissions", permError);

    const created: Role = { id, name: input.name, description: input.description, users: 0 };
    set((s) => ({
      roles: [created, ...s.roles],
      permissionMatrix: { ...s.permissionMatrix, [id]: emptyMatrixRow() },
    }));
    return created;
  },
  updateRole: async (id, patch) => {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row["name"] = patch.name;
    if (patch.description !== undefined) row["description"] = patch.description;
    const { error } = await supabase.from("roles").update(row).eq("id", id);
    if (error) {
      console.error("Failed to update role", error);
      return;
    }
    set((s) => ({ roles: s.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  },
  removeRole: async (id) => {
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) {
      // Most likely cause: profiles.role_id still references this role
      // (no ON DELETE CASCADE there on purpose — deleting a role out from
      // under signed-in accounts would be worse than refusing).
      console.error("Failed to delete role", error);
      return { ok: false, error: error.message };
    }
    set((s) => {
      const { [id]: _removed, ...restMatrix } = s.permissionMatrix;
      return { roles: s.roles.filter((r) => r.id !== id), permissionMatrix: restMatrix };
    });
    return { ok: true };
  },

  leaveTypes: [],
  fetchLeaveTypes: async () => {
    const { data, error } = await supabase
      .from("leave_types")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Failed to load leave types", error);
      return;
    }
    set({
      leaveTypes: (data as LeaveTypeRow[]).map((t) => ({
        id: t.id,
        name: t.name,
        annualAllowance: t.annual_allowance,
        carryOver: t.carry_over,
        color: t.color,
      })),
    });
  },
  addLeaveType: async (leaveType) => {
    const { data, error } = await supabase
      .from("leave_types")
      .insert({
        name: leaveType.name,
        annual_allowance: leaveType.annualAllowance,
        carry_over: leaveType.carryOver,
        color: leaveType.color,
      })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create leave type", error);
      return null;
    }
    const row = data as LeaveTypeRow;
    const created: LeaveType = {
      id: row.id,
      name: row.name,
      annualAllowance: row.annual_allowance,
      carryOver: row.carry_over,
      color: row.color,
    };
    set((s) => ({ leaveTypes: [...s.leaveTypes, created] }));
    return created;
  },
  updateLeaveType: async (id, patch) => {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row["name"] = patch.name;
    if (patch.annualAllowance !== undefined) row["annual_allowance"] = patch.annualAllowance;
    if (patch.carryOver !== undefined) row["carry_over"] = patch.carryOver;
    if (patch.color !== undefined) row["color"] = patch.color;
    const { error } = await supabase.from("leave_types").update(row).eq("id", id);
    if (error) {
      console.error("Failed to update leave type", error);
      return;
    }
    set((s) => ({
      leaveTypes: s.leaveTypes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  },
  removeLeaveType: async (id) => {
    const { error } = await supabase.from("leave_types").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete leave type", error);
      return;
    }
    set((s) => ({ leaveTypes: s.leaveTypes.filter((t) => t.id !== id) }));
  },

  attendancePolicies: attendancePoliciesSeed,
  toggleAttendancePolicy: (id) =>
    set((s) => ({
      attendancePolicies: s.attendancePolicies.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p,
      ),
    })),
}));
