// Data layer for the Projects & Tasks modules.

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

export const deliveryProjects: DeliveryProject[] = [];

export const projectById = (id: string) => deliveryProjects.find((p) => p.id === id);

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

export const projectActivity: ProjectActivity[] = [];

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

export const deliveryTasks: DeliveryTask[] = [];

export const taskStatuses: TaskStatus[] = ["todo", "in-progress", "review", "blocked", "done"];
export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  blocked: "Blocked",
  done: "Done",
};

export const taskById = (id: string) => deliveryTasks.find((t) => t.id === id);
