// Client-side workspace-settings state. Seeded from src/data/workspace.ts.
// Mutations live only in memory for this session — swap for API calls
// later without touching the UI layer.
//
// This is AgencyOS's admin-configuration surface: Departments,
// Designations, Client Packages, Roles, Leave Types and Attendance
// Policies are all editable here rather than hardcoded, and every
// consuming form (Employee create/edit, Client create/edit, Leave
// filters, etc) reads its options from this store live.
import { create } from "zustand";
import {
  attendancePoliciesSeed,
  defaultPermissionMatrix,
  departmentsSeed,
  designationsSeed,
  clientPackagesSeed,
  integrationsSeed,
  leaveTypesSeed,
  notificationEvents,
  permissionModules,
  rolesSeed,
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

type SettingsState = {
  permissionMatrix: PermissionMatrix;
  togglePermission: (roleId: string, module: PermissionModule, action: PermissionAction) => void;
  integrations: Integration[];
  toggleIntegration: (id: string) => void;
  workflowApprovers: Record<(typeof workflowEvents)[number], string>;
  setApprover: (event: (typeof workflowEvents)[number], approver: string) => void;
  notificationPrefs: Record<string, boolean>;
  toggleNotificationPref: (event: string) => void;

  departments: Department[];
  addDepartment: (department: Department) => void;
  updateDepartment: (id: string, patch: Partial<Department>) => void;
  removeDepartment: (id: string) => void;

  designations: Designation[];
  addDesignation: (designation: Designation) => void;
  updateDesignation: (id: string, patch: Partial<Designation>) => void;
  removeDesignation: (id: string) => void;

  clientPackages: ClientPackage[];
  addClientPackage: (pkg: ClientPackage) => void;
  updateClientPackage: (id: string, patch: Partial<ClientPackage>) => void;
  removeClientPackage: (id: string) => void;

  roles: Role[];
  addRole: (role: Role) => void;
  updateRole: (id: string, patch: Partial<Role>) => void;
  removeRole: (id: string) => void;

  leaveTypes: LeaveType[];
  addLeaveType: (leaveType: LeaveType) => void;
  updateLeaveType: (id: string, patch: Partial<LeaveType>) => void;
  removeLeaveType: (id: string) => void;

  attendancePolicies: AttendancePolicy[];
  toggleAttendancePolicy: (id: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  permissionMatrix: defaultPermissionMatrix(),
  togglePermission: (roleId, module, action) =>
    set((s) => ({
      permissionMatrix: {
        ...s.permissionMatrix,
        [roleId]: {
          ...s.permissionMatrix[roleId],
          [module]: {
            ...s.permissionMatrix[roleId]?.[module],
            [action]: !s.permissionMatrix[roleId]?.[module]?.[action],
          },
        },
      } as PermissionMatrix,
    })),
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

  departments: departmentsSeed,
  addDepartment: (department) => set((s) => ({ departments: [department, ...s.departments] })),
  updateDepartment: (id, patch) =>
    set((s) => ({
      departments: s.departments.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),
  removeDepartment: (id) => set((s) => ({ departments: s.departments.filter((d) => d.id !== id) })),

  designations: designationsSeed,
  addDesignation: (designation) => set((s) => ({ designations: [designation, ...s.designations] })),
  updateDesignation: (id, patch) =>
    set((s) => ({
      designations: s.designations.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),
  removeDesignation: (id) =>
    set((s) => ({ designations: s.designations.filter((d) => d.id !== id) })),

  clientPackages: clientPackagesSeed,
  addClientPackage: (pkg) => set((s) => ({ clientPackages: [pkg, ...s.clientPackages] })),
  updateClientPackage: (id, patch) =>
    set((s) => ({
      clientPackages: s.clientPackages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  removeClientPackage: (id) =>
    set((s) => ({ clientPackages: s.clientPackages.filter((p) => p.id !== id) })),

  roles: rolesSeed,
  addRole: (role) =>
    set((s) => ({
      roles: [role, ...s.roles],
      permissionMatrix: {
        ...s.permissionMatrix,
        [role.id]: Object.fromEntries(
          permissionModules.map((mod) => [mod, emptyModulePermissions()]),
        ) as PermissionMatrix[string],
      },
    })),
  updateRole: (id, patch) =>
    set((s) => ({ roles: s.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
  removeRole: (id) =>
    set((s) => {
      const { [id]: _removed, ...restMatrix } = s.permissionMatrix;
      return { roles: s.roles.filter((r) => r.id !== id), permissionMatrix: restMatrix };
    }),

  leaveTypes: leaveTypesSeed,
  addLeaveType: (leaveType) => set((s) => ({ leaveTypes: [leaveType, ...s.leaveTypes] })),
  updateLeaveType: (id, patch) =>
    set((s) => ({
      leaveTypes: s.leaveTypes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  removeLeaveType: (id) => set((s) => ({ leaveTypes: s.leaveTypes.filter((t) => t.id !== id) })),

  attendancePolicies: attendancePoliciesSeed,
  toggleAttendancePolicy: (id) =>
    set((s) => ({
      attendancePolicies: s.attendancePolicies.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p,
      ),
    })),
}));
