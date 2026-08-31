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

export const conversations: Conversation[] = [
  {
    id: "cv-1",
    subject: "Re: Proposal feedback — Aurora Skincare",
    participants: [
      { id: "ext-1", name: "Elena Vos", initials: "EV" },
      { id: "emp-1003", name: "Sofia Marchetti", initials: "SM" },
    ],
    preview: "The team loved the strategy section. Two questions on scope before we sign off…",
    time: "12m",
    unread: true,
    starred: true,
    mention: false,
    folder: "client",
    messages: [
      {
        id: "m-1",
        authorId: "ext-1",
        authorName: "Elena Vos",
        authorInitials: "EV",
        body: "Hi team — the proposal looks fantastic. The strategy section really lands with our exec sponsors.",
        time: "Yesterday, 4:02 PM",
      },
      {
        id: "m-2",
        authorId: "emp-1003",
        authorName: "Sofia Marchetti",
        authorInitials: "SM",
        body: "So glad to hear it! Happy to walk through the scope questions on a quick call this week.",
        time: "Yesterday, 5:40 PM",
      },
      {
        id: "m-3",
        authorId: "ext-1",
        authorName: "Elena Vos",
        authorInitials: "EV",
        body: "The team loved the strategy section. Two questions on scope before we sign off — can we add a paid social pilot in month one?",
        time: "12m ago",
      },
    ],
  },
  {
    id: "cv-2",
    subject: "Volta budget approval",
    participants: [
      { id: "emp-1002", name: "Kenji Tanaka", initials: "KT" },
      { id: "emp-1005", name: "Priya Nair", initials: "PN" },
    ],
    preview: "Need your sign-off before Monday's flight goes live.",
    time: "1h",
    unread: true,
    starred: false,
    mention: true,
    folder: "team",
    messages: [
      {
        id: "m-4",
        authorId: "emp-1002",
        authorName: "Kenji Tanaka",
        authorInitials: "KT",
        body: "@Priya Nair need your sign-off before Monday's flight goes live — budget deck attached.",
        time: "1h ago",
      },
    ],
  },
  {
    id: "cv-3",
    subject: "Sprint review notes",
    participants: [
      { id: "ext-2", name: "Helio Health", initials: "HH" },
      { id: "emp-1004", name: "Liam Bennett", initials: "LB" },
    ],
    preview: "Attaching notes from today's review with the clinical team.",
    time: "4h",
    unread: false,
    starred: false,
    mention: false,
    folder: "client",
    messages: [
      {
        id: "m-5",
        authorId: "ext-2",
        authorName: "Helio Health",
        authorInitials: "HH",
        body: "Attaching notes from today's review with the clinical team. Next milestone is the accessibility audit.",
        time: "4h ago",
      },
    ],
  },
  {
    id: "cv-4",
    subject: "September resourcing draft",
    participants: [{ id: "emp-1006", name: "Ivy Chen", initials: "IC" }],
    preview: "Creative is over-allocated by 18 hours next month.",
    time: "1d",
    unread: false,
    starred: true,
    mention: false,
    folder: "team",
    messages: [
      {
        id: "m-6",
        authorId: "emp-1006",
        authorName: "Ivy Chen",
        authorInitials: "IC",
        body: "Creative is over-allocated by 18 hours next month — can we push the Content Engine kickoff?",
        time: "1d ago",
      },
    ],
  },
  {
    id: "cv-5",
    subject: "Payroll run — August ready for review",
    participants: [{ id: "sys-1", name: "Payroll Bot", initials: "PB" }],
    preview: "August payroll run has been calculated and is ready for your review.",
    time: "2d",
    unread: false,
    starred: false,
    mention: false,
    folder: "system",
    messages: [
      {
        id: "m-7",
        authorId: "sys-1",
        authorName: "Payroll Bot",
        authorInitials: "PB",
        body: "August payroll run has been calculated and is ready for your review in Finance.",
        time: "2d ago",
      },
    ],
  },
];

export type Notification = {
  id: string;
  icon: "mention" | "approval" | "task" | "system" | "leave";
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: "nt-1",
    icon: "mention",
    title: "Kenji Tanaka mentioned you",
    detail: "in Volta budget approval",
    time: "1h",
    read: false,
  },
  {
    id: "nt-2",
    icon: "approval",
    title: "Leave request awaiting approval",
    detail: "Sofia Marchetti requested 3 days off",
    time: "3h",
    read: false,
  },
  {
    id: "nt-3",
    icon: "task",
    title: "Task overdue",
    detail: '"Approve key visual round 3" is now overdue',
    time: "5h",
    read: false,
  },
  {
    id: "nt-4",
    icon: "system",
    title: "Payroll run completed",
    detail: "August payroll processed for 42 employees",
    time: "1d",
    read: true,
  },
  {
    id: "nt-5",
    icon: "leave",
    title: "Leave approved",
    detail: "Your request for Sept 12–13 was approved",
    time: "2d",
    read: true,
  },
];

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

export const assetFiles: AssetFile[] = [
  {
    id: "af-1",
    name: "Northwind Brand Guidelines v3.pdf",
    type: "pdf",
    size: "12.4 MB",
    ownerId: "emp-1001",
    ownerName: "Amara Okafor",
    ownerInitials: "AO",
    tags: ["brand", "northwind"],
    updated: "2026-08-20",
    shared: true,
    expiring: false,
    folderId: "fld-brand",
    versions: [
      { id: "v1", label: "v3", date: "2026-08-20", author: "Amara Okafor" },
      { id: "v2", label: "v2", date: "2026-06-11", author: "Amara Okafor" },
      { id: "v3", label: "v1", date: "2026-03-02", author: "Fatima Zahra" },
    ],
  },
  {
    id: "af-2",
    name: "Volta Motors MSA.pdf",
    type: "pdf",
    size: "1.1 MB",
    ownerId: "emp-1005",
    ownerName: "Priya Nair",
    ownerInitials: "PN",
    tags: ["contract", "legal", "volta"],
    updated: "2026-07-02",
    shared: false,
    expiring: true,
    folderId: "fld-contracts",
    versions: [{ id: "v1", label: "Signed", date: "2026-07-02", author: "Priya Nair" }],
  },
  {
    id: "af-3",
    name: "Q3 Media Kit — Deck.pptx",
    type: "slide",
    size: "34.8 MB",
    ownerId: "emp-1002",
    ownerName: "Kenji Tanaka",
    ownerInitials: "KT",
    tags: ["media", "sales"],
    updated: "2026-08-14",
    shared: true,
    expiring: false,
    folderId: "fld-media",
    versions: [
      { id: "v1", label: "v2", date: "2026-08-14", author: "Kenji Tanaka" },
      { id: "v2", label: "v1", date: "2026-07-30", author: "Kenji Tanaka" },
    ],
  },
  {
    id: "af-4",
    name: "Launch Film — Final Cut.mp4",
    type: "video",
    size: "1.2 GB",
    ownerId: "emp-1099",
    ownerName: "Noah Feldman",
    ownerInitials: "NF",
    tags: ["video", "volta", "creative"],
    updated: "2026-08-25",
    shared: true,
    expiring: false,
    folderId: "root",
    versions: [{ id: "v1", label: "Final", date: "2026-08-25", author: "Noah Feldman" }],
  },
  {
    id: "af-5",
    name: "Helio Health NDA.pdf",
    type: "pdf",
    size: "420 KB",
    ownerId: "emp-1004",
    ownerName: "Liam Bennett",
    ownerInitials: "LB",
    tags: ["legal", "nda"],
    updated: "2026-05-18",
    shared: false,
    expiring: true,
    folderId: "fld-legal",
    versions: [{ id: "v1", label: "Signed", date: "2026-05-18", author: "Liam Bennett" }],
  },
  {
    id: "af-6",
    name: "Logo — Primary Mark.svg",
    type: "image",
    size: "88 KB",
    ownerId: "emp-1001",
    ownerName: "Amara Okafor",
    ownerInitials: "AO",
    tags: ["brand", "logo"],
    updated: "2026-04-02",
    shared: true,
    expiring: false,
    folderId: "fld-brand-logos",
    versions: [{ id: "v1", label: "v1", date: "2026-04-02", author: "Amara Okafor" }],
  },
  {
    id: "af-7",
    name: "Resourcing Model.xlsx",
    type: "sheet",
    size: "2.6 MB",
    ownerId: "emp-1006",
    ownerName: "Ivy Chen",
    ownerInitials: "IC",
    tags: ["operations"],
    updated: "2026-08-27",
    shared: false,
    expiring: false,
    folderId: "root",
    versions: [{ id: "v1", label: "v5", date: "2026-08-27", author: "Ivy Chen" }],
  },
  {
    id: "af-8",
    name: "Terra Outdoor Contract Renewal.pdf",
    type: "pdf",
    size: "980 KB",
    ownerId: "emp-1005",
    ownerName: "Priya Nair",
    ownerInitials: "PN",
    tags: ["contract", "terra"],
    updated: "2026-06-30",
    shared: false,
    expiring: true,
    folderId: "fld-contracts",
    versions: [{ id: "v1", label: "Draft", date: "2026-06-30", author: "Priya Nair" }],
  },
  {
    id: "af-9",
    name: "Brand Assets Archive.zip",
    type: "archive",
    size: "220 MB",
    ownerId: "emp-1001",
    ownerName: "Amara Okafor",
    ownerInitials: "AO",
    tags: ["brand", "archive"],
    updated: "2026-01-15",
    shared: false,
    expiring: false,
    folderId: "fld-brand",
    versions: [{ id: "v1", label: "v1", date: "2026-01-15", author: "Amara Okafor" }],
  },
];

// ---------------- Settings module ----------------

export type Department = { id: string; name: string; head: string; headcount: number };
export const departmentsSeed: Department[] = [
  { id: "dep-1", name: "Creative", head: "Amara Okafor", headcount: 12 },
  { id: "dep-2", name: "Media", head: "Kenji Tanaka", headcount: 9 },
  { id: "dep-3", name: "Strategy", head: "Sofia Marchetti", headcount: 6 },
  { id: "dep-4", name: "Engineering", head: "Liam Bennett", headcount: 8 },
  { id: "dep-5", name: "Operations", head: "Ivy Chen", headcount: 5 },
  { id: "dep-6", name: "Sales", head: "Marcus Doyle", headcount: 7 },
];

export type Designation = { id: string; title: string; department: string; level: string };
export const designationsSeed: Designation[] = [
  { id: "des-1", title: "Creative Director", department: "Creative", level: "Leadership" },
  { id: "des-2", title: "Senior Media Buyer", department: "Media", level: "Senior" },
  { id: "des-3", title: "Account Strategist", department: "Strategy", level: "Mid" },
  { id: "des-4", title: "Frontend Engineer", department: "Engineering", level: "Mid" },
  { id: "des-5", title: "Operations Manager", department: "Operations", level: "Senior" },
  { id: "des-6", title: "Business Development Lead", department: "Sales", level: "Senior" },
];

export type Role = { id: string; name: string; users: number; description: string };
export const rolesSeed: Role[] = [
  {
    id: "role-admin",
    name: "Admin",
    users: 3,
    description: "Full access to all modules and settings.",
  },
  {
    id: "role-manager",
    name: "Manager",
    users: 11,
    description: "Manage teams, approve requests, view reports.",
  },
  {
    id: "role-employee",
    name: "Employee",
    users: 38,
    description: "Standard access to assigned work.",
  },
  {
    id: "role-finance",
    name: "Finance",
    users: 4,
    description: "Access to billing, payroll and invoicing.",
  },
  {
    id: "role-client",
    name: "Client (Portal)",
    users: 14,
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

export const integrationsSeed: Integration[] = [
  {
    id: "int-slack",
    name: "Slack",
    description: "Sync notifications and approvals to channels.",
    connected: true,
    category: "Communication",
  },
  {
    id: "int-gws",
    name: "Google Workspace",
    description: "Single sign-on, calendar and drive sync.",
    connected: true,
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
    connected: true,
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
