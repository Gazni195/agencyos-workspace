// Client-side Tasks state, backed by Supabase's `tasks`, `task_checklist_items`
// and `task_comments` tables (see supabase/migrations/0004_projects_and_tasks.sql).
// Backs both the Projects module's "Tasks" tab and the standalone Task
// Board/List/Calendar module — one source of truth, not two.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import {
  type ChecklistItem,
  type DeliveryTask,
  type TaskComment,
  type TaskStatus,
} from "@/data/delivery";
import { useEmployeesStore } from "./employeesStore";
import { useInboxStore } from "./inboxStore";

type ChecklistRow = { id: string; label: string; done: boolean };
type CommentRow = { id: string; author: string; text: string; written_on: string };
type TaskRow = {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assignee_id: string;
  due: string | null;
  priority: DeliveryTask["priority"];
  status: TaskStatus;
  tags: string[];
  dependencies: string[];
  task_checklist_items: ChecklistRow[];
  task_comments: CommentRow[];
};

function checklistFromRow(row: ChecklistRow): ChecklistItem {
  return { id: row.id, label: row.label, done: row.done };
}

function commentFromRow(row: CommentRow): TaskComment {
  return { id: row.id, author: row.author, text: row.text, when: row.written_on };
}

function fromRow(row: TaskRow): DeliveryTask {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    projectId: row.project_id,
    assigneeId: row.assignee_id,
    due: row.due ?? "",
    priority: row.priority,
    status: row.status,
    tags: row.tags,
    dependencies: row.dependencies,
    checklist: (row.task_checklist_items ?? []).map(checklistFromRow),
    comments: (row.task_comments ?? [])
      .map(commentFromRow)
      .sort((a, b) => b.when.localeCompare(a.when)),
  };
}

function toRow(task: Partial<DeliveryTask>) {
  const row: Record<string, unknown> = {};
  if (task.title !== undefined) row["title"] = task.title;
  if (task.description !== undefined) row["description"] = task.description;
  if (task.projectId !== undefined) row["project_id"] = task.projectId;
  if (task.assigneeId !== undefined) row["assignee_id"] = task.assigneeId;
  if (task.due !== undefined) row["due"] = task.due || null;
  if (task.priority !== undefined) row["priority"] = task.priority;
  if (task.status !== undefined) row["status"] = task.status;
  if (task.tags !== undefined) row["tags"] = task.tags;
  if (task.dependencies !== undefined) row["dependencies"] = task.dependencies;
  return row;
}

export type NewTaskInput = Omit<DeliveryTask, "id" | "checklist" | "comments">;

const TASK_SELECT =
  "*, task_checklist_items(id, label, done), task_comments(id, author, text, written_on)";

type TasksState = {
  tasks: DeliveryTask[];
  loaded: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: NewTaskInput) => Promise<DeliveryTask | null>;
  updateTask: (id: string, patch: Partial<DeliveryTask>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  setStatus: (id: string, status: TaskStatus) => Promise<void>;
  toggleChecklistItem: (taskId: string, itemId: string) => Promise<void>;
  addChecklistItem: (taskId: string, item: Omit<ChecklistItem, "id">) => Promise<void>;
  addComment: (taskId: string, comment: Omit<TaskComment, "id" | "when">) => Promise<void>;
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loaded: false,
  fetchTasks: async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select(TASK_SELECT)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load tasks", error);
      set({ loaded: true });
      return;
    }
    set({ tasks: (data as TaskRow[]).map(fromRow), loaded: true });
  },
  addTask: async (task) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert(toRow(task))
      .select(TASK_SELECT)
      .single();
    if (error || !data) {
      console.error("Failed to create task", error);
      return null;
    }
    const created = fromRow(data as TaskRow);
    set((s) => ({ tasks: [created, ...s.tasks] }));
    if (created.assigneeId) {
      const assignee = useEmployeesStore
        .getState()
        .employees.find((e) => e.id === created.assigneeId);
      if (assignee) {
        useInboxStore.getState().addNotification({
          id: `nt-task-${created.id}`,
          icon: "task",
          title: "Task assigned",
          detail: `"${created.title}" was assigned to ${assignee.name}.`,
          time: "Just now",
          read: false,
        });
      }
    }
    return created;
  },
  updateTask: async (id, patch) => {
    const { error } = await supabase.from("tasks").update(toRow(patch)).eq("id", id);
    if (error) {
      console.error("Failed to update task", error);
      return;
    }
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  },
  removeTask: async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete task", error);
      return;
    }
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },
  setStatus: async (id, status) => {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) {
      console.error("Failed to update task status", error);
      return;
    }
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
  },
  toggleChecklistItem: async (taskId, itemId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    const item = task?.checklist.find((c) => c.id === itemId);
    if (!item) return;
    const done = !item.done;
    const { error } = await supabase.from("task_checklist_items").update({ done }).eq("id", itemId);
    if (error) {
      console.error("Failed to update checklist item", error);
      return;
    }
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? { ...t, checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done } : c)) }
          : t,
      ),
    }));
  },
  addChecklistItem: async (taskId, item) => {
    const { data, error } = await supabase
      .from("task_checklist_items")
      .insert({ task_id: taskId, label: item.label, done: item.done })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to add checklist item", error);
      return;
    }
    const created = checklistFromRow(data as ChecklistRow);
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, checklist: [...t.checklist, created] } : t,
      ),
    }));
  },
  addComment: async (taskId, comment) => {
    const { data, error } = await supabase
      .from("task_comments")
      .insert({ task_id: taskId, author: comment.author, text: comment.text })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to add comment", error);
      return;
    }
    const created = commentFromRow(data as CommentRow);
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [created, ...t.comments] } : t,
      ),
    }));
  },
}));

export const useTask = (id: string) => useTasksStore((s) => s.tasks.find((t) => t.id === id));
