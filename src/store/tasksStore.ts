// Client-side Tasks state. Seeded from src/data/delivery.ts. Kept minimal
// for the Projects module's "Tasks" tab (Phase 3); the full Task Board/List/
// Calendar module (Phase 4) builds its Kanban and other views on this same
// store rather than introducing a second source of truth.
import { create } from "zustand";
import { deliveryTasks, type DeliveryTask, type TaskStatus } from "@/data/delivery";

type TasksState = {
  tasks: DeliveryTask[];
  addTask: (task: DeliveryTask) => void;
  updateTask: (id: string, patch: Partial<DeliveryTask>) => void;
  setStatus: (id: string, status: TaskStatus) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
};

export const useTasksStore = create<TasksState>((set) => ({
  tasks: deliveryTasks,
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
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
}));
