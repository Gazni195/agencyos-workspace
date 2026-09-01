// Real activity timelines for Clients and Projects. clientActivity/
// projectActivity in data/crm.ts and data/delivery.ts are permanently-empty
// seed arrays with no write path anywhere — the Client "Timeline" tab and
// the Project "Recent activity" panel were built against them but could
// never show anything real. This store is what other stores (clientsStore,
// projectsStore, financeStore, leadsStore) and the two "Add note"/"Add
// update" UI actions actually write to, via getState() from outside
// component render — same non-hook pattern as dashboardService.ts.
import { create } from "zustand";
import type { ClientActivityEvent } from "@/modules/clients/types";
import type { ProjectActivity } from "@/modules/projects/types";

type ActivityState = {
  clientActivity: ClientActivityEvent[];
  addClientActivity: (event: ClientActivityEvent) => void;
  projectActivity: ProjectActivity[];
  addProjectActivity: (event: ProjectActivity) => void;
};

export const useActivityStore = create<ActivityState>((set) => ({
  clientActivity: [],
  addClientActivity: (event) => set((s) => ({ clientActivity: [event, ...s.clientActivity] })),
  projectActivity: [],
  addProjectActivity: (event) => set((s) => ({ projectActivity: [event, ...s.projectActivity] })),
}));
