// Client-side Deliverables state. Seeded from src/data/delivery.ts;
// mutations live only in memory for this session.
import { create } from "zustand";
import {
  deliverables as seedDeliverables,
  type Deliverable,
  type DeliverableStatus,
} from "@/data/delivery";

type DeliverablesState = {
  deliverables: Deliverable[];
  addDeliverable: (deliverable: Deliverable) => void;
  updateDeliverable: (id: string, patch: Partial<Deliverable>) => void;
  setStatus: (id: string, status: DeliverableStatus) => void;
};

export const useDeliverablesStore = create<DeliverablesState>((set) => ({
  deliverables: seedDeliverables,
  addDeliverable: (deliverable) => set((s) => ({ deliverables: [deliverable, ...s.deliverables] })),
  updateDeliverable: (id, patch) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),
  setStatus: (id, status) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, status } : d)),
    })),
}));
