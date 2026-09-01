// Types & seed data for the Tasks module.
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
