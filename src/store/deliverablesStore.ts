// Client-side Deliverables state, backed by Supabase's `deliverables` table
// (see supabase/migrations/0008_deliverables.sql).
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { type Deliverable, type DeliverableStatus } from "@/data/delivery";

type DeliverableRow = {
  id: string;
  project_id: string;
  task_id: string | null;
  title: string;
  type: string;
  assignee_id: string;
  status: DeliverableStatus;
  due_date: string;
  notes: string | null;
};

function fromRow(row: DeliverableRow): Deliverable {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    type: row.type,
    assigneeId: row.assignee_id,
    status: row.status,
    dueDate: row.due_date,
    ...(row.task_id ? { taskId: row.task_id } : {}),
    ...(row.notes ? { notes: row.notes } : {}),
  };
}

function toRow(deliverable: Partial<Deliverable>) {
  const row: Record<string, unknown> = {};
  if (deliverable.projectId !== undefined) row["project_id"] = deliverable.projectId;
  if (deliverable.taskId !== undefined) row["task_id"] = deliverable.taskId || null;
  if (deliverable.title !== undefined) row["title"] = deliverable.title;
  if (deliverable.type !== undefined) row["type"] = deliverable.type;
  if (deliverable.assigneeId !== undefined) row["assignee_id"] = deliverable.assigneeId;
  if (deliverable.status !== undefined) row["status"] = deliverable.status;
  if (deliverable.dueDate !== undefined) row["due_date"] = deliverable.dueDate;
  if (deliverable.notes !== undefined) row["notes"] = deliverable.notes || null;
  return row;
}

export type NewDeliverableInput = Omit<Deliverable, "id">;

type DeliverablesState = {
  deliverables: Deliverable[];
  loaded: boolean;
  fetchDeliverables: () => Promise<void>;
  addDeliverable: (deliverable: NewDeliverableInput) => Promise<Deliverable | null>;
  updateDeliverable: (id: string, patch: Partial<Deliverable>) => Promise<void>;
  setStatus: (id: string, status: DeliverableStatus) => Promise<void>;
};

export const useDeliverablesStore = create<DeliverablesState>((set) => ({
  deliverables: [],
  loaded: false,
  fetchDeliverables: async () => {
    const { data, error } = await supabase
      .from("deliverables")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load deliverables", error);
      set({ loaded: true });
      return;
    }
    set({ deliverables: (data as DeliverableRow[]).map(fromRow), loaded: true });
  },
  addDeliverable: async (deliverable) => {
    const { data, error } = await supabase
      .from("deliverables")
      .insert(toRow(deliverable))
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create deliverable", error);
      return null;
    }
    const created = fromRow(data as DeliverableRow);
    set((s) => ({ deliverables: [created, ...s.deliverables] }));
    return created;
  },
  updateDeliverable: async (id, patch) => {
    const { error } = await supabase.from("deliverables").update(toRow(patch)).eq("id", id);
    if (error) {
      console.error("Failed to update deliverable", error);
      return;
    }
    set((s) => ({
      deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  },
  setStatus: async (id, status) => {
    const { error } = await supabase.from("deliverables").update({ status }).eq("id", id);
    if (error) {
      console.error("Failed to update deliverable status", error);
      return;
    }
    set((s) => ({ deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, status } : d)) }));
  },
}));
