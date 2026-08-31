// Client-side Projects state. Seeded from src/data/delivery.ts; mutations
// live only in memory for this session — swap for API calls later without
// touching the UI layer.
import { create } from "zustand";
import { deliveryProjects, type DeliveryProject } from "@/data/delivery";

type ProjectsState = {
  projects: DeliveryProject[];
  addProject: (project: DeliveryProject) => void;
  updateProject: (id: string, patch: Partial<DeliveryProject>) => void;
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: deliveryProjects,
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (id, patch) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
}));
