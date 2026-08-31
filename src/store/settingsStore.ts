// Client-side workspace-settings state. Seeded from src/data/workspace.ts.
// Mutations live only in memory for this session — swap for API calls
// later without touching the UI layer.
import { create } from "zustand";
import {
  defaultPermissionMatrix,
  integrationsSeed,
  notificationEvents,
  workflowEvents,
  type PermissionAction,
  type PermissionMatrix,
  type permissionModules as PermissionModulesConst,
} from "@/data/workspace";
import type { Integration } from "@/data/workspace";

type PermissionModule = (typeof PermissionModulesConst)[number];

type SettingsState = {
  permissionMatrix: PermissionMatrix;
  togglePermission: (roleId: string, module: PermissionModule, action: PermissionAction) => void;
  integrations: Integration[];
  toggleIntegration: (id: string) => void;
  workflowApprovers: Record<(typeof workflowEvents)[number], string>;
  setApprover: (event: (typeof workflowEvents)[number], approver: string) => void;
  notificationPrefs: Record<string, boolean>;
  toggleNotificationPref: (event: string) => void;
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
}));
