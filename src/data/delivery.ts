// Mock data for Projects & Tasks modules.
// Extends the base agency.ts records with richer delivery-focused data.

export type ProjectStatus = "on-track" | "at-risk" | "delayed" | "completed";

export type DeliveryProject = {
  id: string;
  name: string;
  client: string;
  lead: string;
  leadInitials: string;
  team: string[];
  progress: number;
  budget: number;
  spend: number;
  status: ProjectStatus;
  startDate: string;
  due: string;
  description: string;
  health: "green" | "yellow" | "red";
};

export const deliveryProjects: DeliveryProject[] = [
  {
    id: "pr-1",
    name: "Brand Refresh",
    client: "Northwind Coffee",
    lead: "Amara Okafor",
    leadInitials: "AO",
    team: ["emp-1001", "emp-1006", "emp-1009"],
    progress: 72,
    budget: 86000,
    spend: 58900,
    status: "on-track",
    startDate: "2026-06-01",
    due: "2026-09-30",
    description:
      "Full brand identity refresh for Northwind Coffee including logo system, packaging guidelines and a new retail visual language.",
    health: "green",
  },
  {
    id: "pr-2",
    name: "Q3 Paid Media",
    client: "Volta Motors",
    lead: "Kenji Tanaka",
    leadInitials: "KT",
    team: ["emp-1002", "emp-1005"],
    progress: 54,
    budget: 210000,
    spend: 121000,
    status: "on-track",
    startDate: "2026-07-01",
    due: "2026-10-15",
    description:
      "Cross-channel paid media program covering search, social and programmatic for the Volta Q3 EV launch push.",
    health: "green",
  },
  {
    id: "pr-3",
    name: "Website Rebuild",
    client: "Helio Health",
    lead: "Liam Bennett",
    leadInitials: "LB",
    team: ["emp-1004", "emp-1010", "emp-1008"],
    progress: 38,
    budget: 124000,
    spend: 79500,
    status: "at-risk",
    startDate: "2026-05-12",
    due: "2026-11-04",
    description:
      "Rebuild of the Helio Health patient portal and marketing site on a new headless CMS with a refreshed design system.",
    health: "yellow",
  },
  {
    id: "pr-4",
    name: "Launch Film",
    client: "Volta Motors",
    lead: "Noah Feldman",
    leadInitials: "NF",
    team: ["emp-1006", "emp-1001"],
    progress: 88,
    budget: 64000,
    spend: 55200,
    status: "on-track",
    startDate: "2026-06-20",
    due: "2026-09-08",
    description: "Hero launch film and cutdowns for the Volta Aster EV reveal event.",
    health: "green",
  },
  {
    id: "pr-5",
    name: "Content Engine",
    client: "Northwind Coffee",
    lead: "Fatima Zahra",
    leadInitials: "FZ",
    team: ["emp-1009", "emp-1003"],
    progress: 21,
    budget: 38000,
    spend: 29800,
    status: "delayed",
    startDate: "2026-04-01",
    due: "2026-12-01",
    description:
      "Always-on editorial and SEO content engine covering blog, newsletter and social repurposing for Northwind Coffee.",
    health: "red",
  },
  {
    id: "pr-6",
    name: "Fintech Rebrand",
    client: "Lumen Finance",
    lead: "Sofia Marchetti",
    leadInitials: "SM",
    team: ["emp-1003", "emp-1007"],
    progress: 12,
    budget: 96000,
    spend: 8100,
    status: "on-track",
    startDate: "2026-08-10",
    due: "2027-01-20",
    description:
      "Positioning, naming and visual identity refresh ahead of Lumen Finance's Series B announcement.",
    health: "green",
  },
];

export const projectById = (id: string) => deliveryProjects.find((p) => p.id === id);

export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  date: string;
  status: "done" | "in-progress" | "upcoming";
};

export const milestones: Milestone[] = [
  { id: "ms-1", projectId: "pr-1", title: "Discovery & audit", date: "2026-06-12", status: "done" },
  {
    id: "ms-2",
    projectId: "pr-1",
    title: "Logo concepts approved",
    date: "2026-07-18",
    status: "done",
  },
  {
    id: "ms-3",
    projectId: "pr-1",
    title: "Packaging design system",
    date: "2026-08-29",
    status: "in-progress",
  },
  {
    id: "ms-4",
    projectId: "pr-1",
    title: "Retail rollout kit",
    date: "2026-09-25",
    status: "upcoming",
  },

  {
    id: "ms-5",
    projectId: "pr-2",
    title: "Media plan sign-off",
    date: "2026-07-05",
    status: "done",
  },
  { id: "ms-6", projectId: "pr-2", title: "Flight 1 live", date: "2026-08-01", status: "done" },
  {
    id: "ms-7",
    projectId: "pr-2",
    title: "Mid-flight optimization",
    date: "2026-09-10",
    status: "in-progress",
  },
  {
    id: "ms-8",
    projectId: "pr-2",
    title: "Final performance report",
    date: "2026-10-14",
    status: "upcoming",
  },

  {
    id: "ms-9",
    projectId: "pr-3",
    title: "Content model finalized",
    date: "2026-06-01",
    status: "done",
  },
  {
    id: "ms-10",
    projectId: "pr-3",
    title: "Design system handoff",
    date: "2026-08-15",
    status: "in-progress",
  },
  { id: "ms-11", projectId: "pr-3", title: "Beta launch", date: "2026-10-01", status: "upcoming" },
  {
    id: "ms-12",
    projectId: "pr-3",
    title: "Public launch",
    date: "2026-11-04",
    status: "upcoming",
  },

  { id: "ms-13", projectId: "pr-4", title: "Storyboard lock", date: "2026-07-02", status: "done" },
  { id: "ms-14", projectId: "pr-4", title: "Principal shoot", date: "2026-07-28", status: "done" },
  {
    id: "ms-15",
    projectId: "pr-4",
    title: "Final color & mix",
    date: "2026-08-30",
    status: "in-progress",
  },

  {
    id: "ms-16",
    projectId: "pr-5",
    title: "Editorial calendar Q3",
    date: "2026-05-10",
    status: "done",
  },
  { id: "ms-17", projectId: "pr-5", title: "SEO audit", date: "2026-07-01", status: "in-progress" },
  {
    id: "ms-18",
    projectId: "pr-5",
    title: "Q4 content plan",
    date: "2026-11-01",
    status: "upcoming",
  },

  {
    id: "ms-19",
    projectId: "pr-6",
    title: "Positioning workshop",
    date: "2026-08-22",
    status: "in-progress",
  },
  {
    id: "ms-20",
    projectId: "pr-6",
    title: "Naming exploration",
    date: "2026-09-20",
    status: "upcoming",
  },
];

export type ProjectAllocation = {
  projectId: string;
  employeeId: string;
  role: string;
  allocation: number; // percentage
};

export const projectAllocations: ProjectAllocation[] = [
  { projectId: "pr-1", employeeId: "emp-1001", role: "Creative Director", allocation: 40 },
  { projectId: "pr-1", employeeId: "emp-1006", role: "Motion Designer", allocation: 25 },
  { projectId: "pr-1", employeeId: "emp-1009", role: "Content Strategist", allocation: 15 },

  { projectId: "pr-2", employeeId: "emp-1002", role: "Senior Media Buyer", allocation: 60 },
  { projectId: "pr-2", employeeId: "emp-1005", role: "Head of Media", allocation: 20 },

  { projectId: "pr-3", employeeId: "emp-1004", role: "Frontend Engineer", allocation: 70 },
  { projectId: "pr-3", employeeId: "emp-1010", role: "Backend Engineer", allocation: 45 },
  { projectId: "pr-3", employeeId: "emp-1008", role: "Account Lead", allocation: 10 },

  { projectId: "pr-4", employeeId: "emp-1006", role: "Motion Designer", allocation: 50 },
  { projectId: "pr-4", employeeId: "emp-1001", role: "Creative Director", allocation: 15 },

  { projectId: "pr-5", employeeId: "emp-1009", role: "Content Strategist", allocation: 55 },
  { projectId: "pr-5", employeeId: "emp-1003", role: "Account Strategist", allocation: 20 },

  { projectId: "pr-6", employeeId: "emp-1003", role: "Account Strategist", allocation: 35 },
  { projectId: "pr-6", employeeId: "emp-1007", role: "Operations Manager", allocation: 10 },
];

export type BudgetBurnPoint = { week: string; planned: number; actual: number };

export const budgetBurn: Record<string, BudgetBurnPoint[]> = {
  "pr-1": [
    { week: "W1", planned: 8000, actual: 7400 },
    { week: "W2", planned: 18000, actual: 16800 },
    { week: "W3", planned: 30000, actual: 27600 },
    { week: "W4", planned: 44000, actual: 39800 },
    { week: "W5", planned: 58000, actual: 49200 },
    { week: "W6", planned: 72000, actual: 58900 },
  ],
  "pr-2": [
    { week: "W1", planned: 25000, actual: 22000 },
    { week: "W2", planned: 55000, actual: 51000 },
    { week: "W3", planned: 85000, actual: 79000 },
    { week: "W4", planned: 115000, actual: 101000 },
    { week: "W5", planned: 150000, actual: 121000 },
  ],
  "pr-3": [
    { week: "W1", planned: 15000, actual: 16200 },
    { week: "W2", planned: 32000, actual: 35400 },
    { week: "W3", planned: 50000, actual: 55800 },
    { week: "W4", planned: 68000, actual: 79500 },
  ],
  "pr-4": [
    { week: "W1", planned: 12000, actual: 11500 },
    { week: "W2", planned: 26000, actual: 25200 },
    { week: "W3", planned: 42000, actual: 41000 },
    { week: "W4", planned: 58000, actual: 55200 },
  ],
  "pr-5": [
    { week: "W1", planned: 6000, actual: 7200 },
    { week: "W2", planned: 13000, actual: 15900 },
    { week: "W3", planned: 21000, actual: 24800 },
    { week: "W4", planned: 29000, actual: 29800 },
  ],
  "pr-6": [
    { week: "W1", planned: 3000, actual: 2800 },
    { week: "W2", planned: 7000, actual: 5300 },
    { week: "W3", planned: 12000, actual: 8100 },
  ],
};

export type ProjectActivity = {
  id: string;
  projectId: string;
  who: string;
  what: string;
  when: string;
};

export const projectActivity: ProjectActivity[] = [
  {
    id: "pa-1",
    projectId: "pr-1",
    who: "Amara Okafor",
    what: "uploaded 3 new key visual concepts",
    when: "2h ago",
  },
  {
    id: "pa-2",
    projectId: "pr-1",
    who: "Fatima Zahra",
    what: "added copy notes to packaging brief",
    when: "Yesterday",
  },
  {
    id: "pa-3",
    projectId: "pr-1",
    who: "Noah Feldman",
    what: "marked 'Logo concepts approved' complete",
    when: "3 days ago",
  },
  {
    id: "pa-4",
    projectId: "pr-2",
    who: "Kenji Tanaka",
    what: "rebalanced budget across channels",
    when: "5h ago",
  },
  {
    id: "pa-5",
    projectId: "pr-2",
    who: "Priya Nair",
    what: "approved flight 1 creative",
    when: "2 days ago",
  },
  {
    id: "pa-6",
    projectId: "pr-3",
    who: "Liam Bennett",
    what: "pushed component library v2",
    when: "1h ago",
  },
  {
    id: "pa-7",
    projectId: "pr-3",
    who: "Diego Alvarez",
    what: "flagged API latency risk",
    when: "1 day ago",
  },
  {
    id: "pa-8",
    projectId: "pr-5",
    who: "Fatima Zahra",
    what: "requested deadline extension",
    when: "6h ago",
  },
];

export type ProjectFile = {
  id: string;
  projectId: string;
  name: string;
  category: "Brief" | "Design" | "Contract" | "Deliverable" | "Report";
  size: string;
  uploadedBy: string;
  uploadedOn: string;
};

export const projectFiles: ProjectFile[] = [
  {
    id: "pf-1",
    projectId: "pr-1",
    name: "Brand Refresh Creative Brief.pdf",
    category: "Brief",
    size: "212 KB",
    uploadedBy: "Amara Okafor",
    uploadedOn: "2026-06-02",
  },
  {
    id: "pf-2",
    projectId: "pr-1",
    name: "Logo System v3.fig",
    category: "Design",
    size: "18.4 MB",
    uploadedBy: "Amara Okafor",
    uploadedOn: "2026-07-20",
  },
  {
    id: "pf-3",
    projectId: "pr-1",
    name: "Packaging Guidelines Draft.pdf",
    category: "Deliverable",
    size: "4.1 MB",
    uploadedBy: "Fatima Zahra",
    uploadedOn: "2026-08-25",
  },
  {
    id: "pf-4",
    projectId: "pr-2",
    name: "Q3 Media Plan.xlsx",
    category: "Brief",
    size: "1.2 MB",
    uploadedBy: "Kenji Tanaka",
    uploadedOn: "2026-07-03",
  },
  {
    id: "pf-5",
    projectId: "pr-2",
    name: "Flight 1 Creative Assets.zip",
    category: "Design",
    size: "86 MB",
    uploadedBy: "Kenji Tanaka",
    uploadedOn: "2026-08-01",
  },
  {
    id: "pf-6",
    projectId: "pr-3",
    name: "Website Rebuild SOW.pdf",
    category: "Contract",
    size: "455 KB",
    uploadedBy: "Liam Bennett",
    uploadedOn: "2026-01-09",
  },
  {
    id: "pf-7",
    projectId: "pr-3",
    name: "Component Library v2 Docs.pdf",
    category: "Deliverable",
    size: "2.8 MB",
    uploadedBy: "Liam Bennett",
    uploadedOn: "2026-08-15",
  },
  {
    id: "pf-8",
    projectId: "pr-3",
    name: "API Schema Draft.json",
    category: "Report",
    size: "44 KB",
    uploadedBy: "Diego Alvarez",
    uploadedOn: "2026-08-24",
  },
  {
    id: "pf-9",
    projectId: "pr-4",
    name: "Launch Film Storyboard.pdf",
    category: "Brief",
    size: "3.4 MB",
    uploadedBy: "Noah Feldman",
    uploadedOn: "2026-06-18",
  },
  {
    id: "pf-10",
    projectId: "pr-4",
    name: "Final Cut — Master.mp4",
    category: "Deliverable",
    size: "1.2 GB",
    uploadedBy: "Noah Feldman",
    uploadedOn: "2026-08-25",
  },
  {
    id: "pf-11",
    projectId: "pr-5",
    name: "Q3 Editorial Calendar.xlsx",
    category: "Brief",
    size: "340 KB",
    uploadedBy: "Fatima Zahra",
    uploadedOn: "2026-05-12",
  },
  {
    id: "pf-12",
    projectId: "pr-5",
    name: "SEO Audit Report.pdf",
    category: "Report",
    size: "1.6 MB",
    uploadedBy: "Fatima Zahra",
    uploadedOn: "2026-07-05",
  },
  {
    id: "pf-13",
    projectId: "pr-6",
    name: "Positioning Workshop Deck.pdf",
    category: "Brief",
    size: "2.9 MB",
    uploadedBy: "Sofia Marchetti",
    uploadedOn: "2026-08-22",
  },
];

export const projectFilesByProject = (projectId: string) =>
  projectFiles.filter((f) => f.projectId === projectId);

export type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type ChecklistItem = { id: string; label: string; done: boolean };
export type TaskComment = { id: string; author: string; text: string; when: string };

export type DeliveryTask = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  due: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  dependencies: string[];
  checklist: ChecklistItem[];
  comments: TaskComment[];
};

export const deliveryTasks: DeliveryTask[] = [
  {
    id: "tk-1",
    title: "Approve key visual round 3",
    description:
      "Review the third round of key visual concepts and provide sign-off for production.",
    projectId: "pr-1",
    assigneeId: "emp-1001",
    due: "2026-08-29",
    priority: "high",
    status: "in-progress",
    tags: ["creative", "approval"],
    dependencies: [],
    checklist: [
      { id: "cl-1", label: "Review concept A", done: true },
      { id: "cl-2", label: "Review concept B", done: true },
      { id: "cl-3", label: "Collect client feedback", done: false },
    ],
    comments: [
      {
        id: "cm-1",
        author: "Fatima Zahra",
        text: "Client leans towards concept B, waiting on final word.",
        when: "2h ago",
      },
    ],
  },
  {
    id: "tk-2",
    title: "Rebalance Q3 media budget",
    description: "Shift 15% of spend from display to paid social based on last week's performance.",
    projectId: "pr-2",
    assigneeId: "emp-1002",
    due: "2026-08-30",
    priority: "high",
    status: "todo",
    tags: ["media", "budget"],
    dependencies: [],
    checklist: [
      { id: "cl-4", label: "Pull performance report", done: true },
      { id: "cl-5", label: "Draft new split", done: false },
      { id: "cl-6", label: "Get Priya's sign-off", done: false },
    ],
    comments: [],
  },
  {
    id: "tk-3",
    title: "Ship design tokens package",
    description: "Publish the shared design tokens npm package for the new component library.",
    projectId: "pr-3",
    assigneeId: "emp-1004",
    due: "2026-09-02",
    priority: "medium",
    status: "blocked",
    tags: ["engineering"],
    dependencies: ["tk-9"],
    checklist: [
      { id: "cl-7", label: "Finalize color tokens", done: true },
      { id: "cl-8", label: "Write usage docs", done: false },
    ],
    comments: [
      {
        id: "cm-2",
        author: "Diego Alvarez",
        text: "Let's align naming with the API schema before publishing.",
        when: "1 day ago",
      },
    ],
  },
  {
    id: "tk-4",
    title: "Final color grade",
    description: "Complete final color grade pass on the launch film before mix.",
    projectId: "pr-4",
    assigneeId: "emp-1006",
    due: "2026-09-01",
    priority: "medium",
    status: "review",
    tags: ["video", "post-production"],
    dependencies: [],
    checklist: [
      { id: "cl-9", label: "Grade scene 1-4", done: true },
      { id: "cl-10", label: "Grade scene 5-8", done: true },
      { id: "cl-11", label: "Director review", done: false },
    ],
    comments: [],
  },
  {
    id: "tk-5",
    title: "Q4 editorial outline",
    description: "Draft the Q4 editorial calendar outline covering blog and newsletter themes.",
    projectId: "pr-5",
    assigneeId: "emp-1009",
    due: "2026-09-05",
    priority: "low",
    status: "todo",
    tags: ["content"],
    dependencies: [],
    checklist: [{ id: "cl-12", label: "List candidate topics", done: false }],
    comments: [],
  },
  {
    id: "tk-6",
    title: "Renewal deck for Helio",
    description: "Build the renewal pitch deck highlighting Q3 wins for the Helio Health account.",
    projectId: "pr-3",
    assigneeId: "emp-1008",
    due: "2026-08-31",
    priority: "high",
    status: "todo",
    tags: ["sales", "account"],
    dependencies: [],
    checklist: [
      { id: "cl-13", label: "Gather KPI wins", done: true },
      { id: "cl-14", label: "Design slides", done: false },
    ],
    comments: [],
  },
  {
    id: "tk-7",
    title: "Retail rollout kit assets",
    description: "Package all retail signage and packaging assets for the Northwind rollout.",
    projectId: "pr-1",
    assigneeId: "emp-1006",
    due: "2026-09-20",
    priority: "medium",
    status: "todo",
    tags: ["creative"],
    dependencies: ["tk-1"],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-8",
    title: "Mid-flight performance readout",
    description: "Prepare mid-flight performance readout deck for Volta stakeholders.",
    projectId: "pr-2",
    assigneeId: "emp-1005",
    due: "2026-09-12",
    priority: "medium",
    status: "todo",
    tags: ["media", "reporting"],
    dependencies: [],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-9",
    title: "API schema alignment",
    description: "Align frontend and backend on the content API schema before CMS integration.",
    projectId: "pr-3",
    assigneeId: "emp-1010",
    due: "2026-08-28",
    priority: "urgent",
    status: "in-progress",
    tags: ["engineering"],
    dependencies: [],
    checklist: [
      { id: "cl-15", label: "Draft schema", done: true },
      { id: "cl-16", label: "Review with frontend", done: false },
    ],
    comments: [
      {
        id: "cm-3",
        author: "Liam Bennett",
        text: "Blocking the tokens package, prioritizing this today.",
        when: "3h ago",
      },
    ],
  },
  {
    id: "tk-10",
    title: "Positioning workshop prep",
    description:
      "Prepare workshop materials and discussion guide for the Lumen positioning session.",
    projectId: "pr-6",
    assigneeId: "emp-1003",
    due: "2026-09-03",
    priority: "medium",
    status: "todo",
    tags: ["strategy"],
    dependencies: [],
    checklist: [{ id: "cl-17", label: "Draft discussion guide", done: false }],
    comments: [],
  },
  {
    id: "tk-11",
    title: "SEO technical audit",
    description: "Run a full technical SEO audit across the Northwind content properties.",
    projectId: "pr-5",
    assigneeId: "emp-1009",
    due: "2026-09-08",
    priority: "medium",
    status: "in-progress",
    tags: ["seo"],
    dependencies: [],
    checklist: [
      { id: "cl-18", label: "Crawl site", done: true },
      { id: "cl-19", label: "Document findings", done: false },
    ],
    comments: [],
  },
  {
    id: "tk-12",
    title: "Component library QA pass",
    description: "QA the new component library across breakpoints and browsers.",
    projectId: "pr-3",
    assigneeId: "emp-1004",
    due: "2026-09-06",
    priority: "medium",
    status: "todo",
    tags: ["engineering", "qa"],
    dependencies: ["tk-3"],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-13",
    title: "Social cutdowns delivery",
    description: "Deliver 6 social cutdown edits from the launch film master.",
    projectId: "pr-4",
    assigneeId: "emp-1006",
    due: "2026-09-05",
    priority: "low",
    status: "todo",
    tags: ["video"],
    dependencies: ["tk-4"],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-14",
    title: "Client health check-in",
    description: "Quarterly health check-in call with Helio Health stakeholders.",
    projectId: "pr-3",
    assigneeId: "emp-1008",
    due: "2026-09-15",
    priority: "low",
    status: "todo",
    tags: ["account"],
    dependencies: [],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-15",
    title: "Newsletter template redesign",
    description: "Redesign the monthly newsletter template for improved click-through.",
    projectId: "pr-5",
    assigneeId: "emp-1009",
    due: "2026-08-27",
    priority: "low",
    status: "done",
    tags: ["content", "design"],
    dependencies: [],
    checklist: [{ id: "cl-20", label: "Design new template", done: true }],
    comments: [
      { id: "cm-4", author: "Sofia Marchetti", text: "Looks great, ship it.", when: "2 days ago" },
    ],
  },
  {
    id: "tk-16",
    title: "Media buy reconciliation",
    description: "Reconcile August media spend against invoices from all vendors.",
    projectId: "pr-2",
    assigneeId: "emp-1002",
    due: "2026-08-26",
    priority: "medium",
    status: "done",
    tags: ["finance", "media"],
    dependencies: [],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-17",
    title: "Naming shortlist review",
    description: "Review the naming shortlist with legal for trademark clearance.",
    projectId: "pr-6",
    assigneeId: "emp-1007",
    due: "2026-09-25",
    priority: "medium",
    status: "todo",
    tags: ["strategy", "legal"],
    dependencies: ["tk-10"],
    checklist: [],
    comments: [],
  },
  {
    id: "tk-18",
    title: "Packaging print proofs",
    description: "Review and approve print proofs for new packaging before mass production.",
    projectId: "pr-1",
    assigneeId: "emp-1001",
    due: "2026-09-18",
    priority: "high",
    status: "review",
    tags: ["creative", "production"],
    dependencies: ["tk-7"],
    checklist: [
      { id: "cl-21", label: "Check color accuracy", done: true },
      { id: "cl-22", label: "Check die lines", done: false },
    ],
    comments: [],
  },
];

export const taskStatuses: TaskStatus[] = ["todo", "in-progress", "review", "blocked", "done"];
export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  blocked: "Blocked",
  done: "Done",
};

export const taskById = (id: string) => deliveryTasks.find((t) => t.id === id);
