// Client-side Tasks state. Seeded from src/data/delivery.ts. Backs both the
// Projects module's "Tasks" tab (Phase 3) and the standalone Task Board/
// List/Calendar module (Phase 4) — one source of truth, not two.
import { create } from "zustand";
import {
  deliveryTasks,
  type ChecklistItem,
  type DeliveryTask,
  type TaskComment,
  type TaskStatus,
} from "@/modules/tasks/types";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { useInboxStore } from "@/modules/inbox/frontend/store/inboxStore";

type TasksState = {
  tasks: DeliveryTask[];
  addTask: (task: DeliveryTask) => void;
  updateTask: (id: string, patch: Partial<DeliveryTask>) => void;
  setStatus: (id: string, status: TaskStatus) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, item: ChecklistItem) => void;
  addComment: (taskId: string, comment: TaskComment) => void;
};

export const useTasksStore = create<TasksState>((set) => ({
  tasks: deliveryTasks,
  addTask: (task) => {
    set((s) => ({ tasks: [task, ...s.tasks] }));
    if (task.assigneeId) {
      const assignee = useEmployeesStore.getState().employees.find((e) => e.id === task.assigneeId);
      if (assignee) {
        useInboxStore.getState().addNotification({
          id: `nt-task-${task.id}`,
          icon: "task",
          title: "Task assigned",
          detail: `"${task.title}" was assigned to ${assignee.name}.`,
          time: "Just now",
          read: false,
        });
      }
    }
  },
  updateTask: (id, patch) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
  setStatus: (id, status) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
  toggleChecklistItem: (taskId, itemId) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
            }
          : t,
      ),
    })),
  addChecklistItem: (taskId, item) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, checklist: [...t.checklist, item] } : t,
      ),
    })),
  addComment: (taskId, comment) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t,
      ),
    })),
}));
