// Types & seed data for the Projects module (includes Tasks' sibling
// Deliverable entity, since a Deliverable is fundamentally project-scoped).
export type ProjectStatus = "on-track" | "at-risk" | "delayed" | "completed";

export type DeliveryProject = {
  id: string;
  name: string;
  clientId: string;
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

export const deliveryProjects: DeliveryProject[] = [];

export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  date: string;
  status: "done" | "in-progress" | "upcoming";
};

export const milestones: Milestone[] = [];

export type ProjectAllocation = {
  projectId: string;
  employeeId: string;
  role: string;
  allocation: number; // percentage
};

export const projectAllocations: ProjectAllocation[] = [];

export type BudgetBurnPoint = { week: string; planned: number; actual: number };

export const budgetBurn: Record<string, BudgetBurnPoint[]> = {};

export type ProjectActivity = {
  id: string;
  projectId: string;
  who: string;
  what: string;
  when: string;
};

export type ProjectFile = {
  id: string;
  projectId: string;
  name: string;
  category: "Brief" | "Design" | "Contract" | "Deliverable" | "Report";
  size: string;
  uploadedBy: string;
  uploadedOn: string;
};

export const projectFiles: ProjectFile[] = [];

export const projectFilesByProject = (projectId: string) =>
  projectFiles.filter((f) => f.projectId === projectId);

// A Deliverable is the actual client-facing output a project produces (an
// edited video, a photo set, a design file, a written report) — distinct
// from a Task, which is internal work that may or may not produce one.
// Tracking it separately is what lets Operations show a real
// pending-approval queue instead of overloading task status for it.
export type DeliverableStatus =
  "in-progress" | "internal-review" | "client-review" | "changes-requested" | "approved";

export type Deliverable = {
  id: string;
  projectId: string;
  taskId?: string;
  title: string;
  type: string;
  assigneeId: string;
  status: DeliverableStatus;
  dueDate: string;
  notes?: string;
};

export const deliverables: Deliverable[] = [];

export const deliverableStatuses: DeliverableStatus[] = [
  "in-progress",
  "internal-review",
  "client-review",
  "changes-requested",
  "approved",
];

export const deliverableStatusLabels: Record<DeliverableStatus, string> = {
  "in-progress": "In Progress",
  "internal-review": "Internal Review",
  "client-review": "Client Review",
  "changes-requested": "Changes Requested",
  approved: "Approved",
};
