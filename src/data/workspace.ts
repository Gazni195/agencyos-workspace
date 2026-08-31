// Mock data layer for Inbox, Assets and Settings modules.
// Local-state only — mirrors future backend shapes.

export type Message = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  body: string;
  time: string;
};

export type Conversation = {
  id: string;
  subject: string;
  participants: { id: string; name: string; initials: string }[];
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  mention: boolean;
  folder: "team" | "client" | "system";
  messages: Message[];
};

export const conversations: Conversation[] = [];

export type Notification = {
  id: string;
  icon: "mention" | "approval" | "task" | "system" | "leave";
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [];

// ---------------- Assets module ----------------

export type AssetFile = {
  id: string;
  name: string;
  type: "doc" | "sheet" | "image" | "video" | "pdf" | "slide" | "archive";
  size: string;
  ownerId: string;
  ownerName: string;
  ownerInitials: string;
  tags: string[];
  updated: string;
  shared: boolean;
  expiring: boolean;
  folderId: string;
  versions: { id: string; label: string; date: string; author: string }[];
};

export type AssetFolder = {
  id: string;
  name: string;
  parentId: string | null;
};

export const assetFolders: AssetFolder[] = [
  { id: "root", name: "All Assets", parentId: null },
  { id: "fld-brand", name: "Brand Guidelines", parentId: "root" },
  { id: "fld-contracts", name: "Client Contracts", parentId: "root" },
  { id: "fld-media", name: "Media Kits", parentId: "root" },
  { id: "fld-legal", name: "Legal", parentId: "root" },
  { id: "fld-brand-logos", name: "Logo Files", parentId: "fld-brand" },
];

export const assetFiles: AssetFile[] = [];

// ---------------- Settings module ----------------

export type Department = { id: string; name: string; head: string; headcount: number };
export const departmentsSeed: Department[] = [];

export type Designation = { id: string; title: string; department: string; level: string };
export const designationsSeed: Designation[] = [];

// Role catalog stays defined (it's the app's fixed vocabulary of access
// levels, needed for the permission matrix to have rows to render) — only
// the per-role user counts start at zero since no users exist yet.
export type Role = { id: string; name: string; users: number; description: string };
export const rolesSeed: Role[] = [
  {
    id: "role-admin",
    name: "Admin",
    users: 0,
    description: "Full access to all modules and settings.",
  },
  {
    id: "role-manager",
    name: "Manager",
    users: 0,
    description: "Manage teams, approve requests, view reports.",
  },
  {
    id: "role-employee",
    name: "Employee",
    users: 0,
    description: "Standard access to assigned work.",
  },
  {
    id: "role-finance",
    name: "Finance",
    users: 0,
    description: "Access to billing, payroll and invoicing.",
  },
  {
    id: "role-client",
    name: "Client (Portal)",
    users: 0,
    description: "Limited external view of shared projects.",
  },
];

export const permissionModules = [
  "Employees",
  "Projects",
  "Finance",
  "Leads",
  "Assets",
  "Reports",
  "Settings",
] as const;
export type PermissionAction = "view" | "edit" | "delete";
export type PermissionMatrix = Record<
  string,
  Record<(typeof permissionModules)[number], Record<PermissionAction, boolean>>
>;

export function defaultPermissionMatrix(): PermissionMatrix {
  const matrix: PermissionMatrix = {};
  for (const role of rolesSeed) {
    const roleMatrix = (matrix[role.id] = {} as PermissionMatrix[string]);
    for (const mod of permissionModules) {
      const isAdmin = role.id === "role-admin";
      const isManager = role.id === "role-manager";
      const isClient = role.id === "role-client";
      roleMatrix[mod] = {
        view: isAdmin || isManager || !isClient || mod === "Projects",
        edit: isAdmin || (isManager && mod !== "Settings"),
        delete: isAdmin,
      };
    }
  }
  return matrix;
}

export type Integration = {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  category: string;
};

// Integration catalog stays defined (which third-party apps this product
// supports connecting to is app configuration, not sample data) — every
// entry starts disconnected since no workspace has connected anything yet.
export const integrationsSeed: Integration[] = [
  {
    id: "int-slack",
    name: "Slack",
    description: "Sync notifications and approvals to channels.",
    connected: false,
    category: "Communication",
  },
  {
    id: "int-gws",
    name: "Google Workspace",
    description: "Single sign-on, calendar and drive sync.",
    connected: false,
    category: "Productivity",
  },
  {
    id: "int-hubspot",
    name: "HubSpot",
    description: "Two-way sync of leads and pipeline stages.",
    connected: false,
    category: "CRM",
  },
  {
    id: "int-xero",
    name: "Xero",
    description: "Push invoices and reconcile payments automatically.",
    connected: false,
    category: "Finance",
  },
  {
    id: "int-meta",
    name: "Meta Ads",
    description: "Import spend and performance for paid social.",
    connected: false,
    category: "Media",
  },
  {
    id: "int-google-ads",
    name: "Google Ads",
    description: "Import spend and conversions for search & display.",
    connected: false,
    category: "Media",
  },
];

export const workflowEvents = [
  "Leave Request",
  "Timesheet Submission",
  "Invoice Approval",
] as const;
export const approverOptions = [
  "Direct Manager",
  "Department Head",
  "Finance Lead",
  "Operations Manager",
  "Admin",
];

export const notificationEvents = [
  "New task assigned",
  "Task overdue",
  "Leave request submitted",
  "Leave request approved",
  "Invoice sent",
  "Payment received",
  "Mentioned in a message",
  "Project status changed",
];
