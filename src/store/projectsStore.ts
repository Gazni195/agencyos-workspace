// Client-side Projects state. Seeded from src/data/delivery.ts; mutations
// live only in memory for this session — swap for API calls later without
// touching the UI layer.
import { create } from "zustand";
import { deliveryProjects, type DeliveryProject, type ProjectStatus } from "@/data/delivery";
import { useActivityStore } from "./activityStore";
import { getCurrentUser } from "@/hooks/useCurrentUser";

const statusLabel: Record<ProjectStatus, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  delayed: "Delayed",
  completed: "Completed",
};

type ProjectsState = {
  projects: DeliveryProject[];
  addProject: (project: DeliveryProject) => void;
  updateProject: (id: string, patch: Partial<DeliveryProject>) => void;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: deliveryProjects,
  addProject: (project) => {
    set((s) => ({ projects: [project, ...s.projects] }));
    const who = getCurrentUser().name;
    const when = new Date().toISOString().slice(0, 10);
    useActivityStore.getState().addProjectActivity({
      id: `pa-${project.id}-created`,
      projectId: project.id,
      who,
      what: "created this project",
      when,
    });
    useActivityStore.getState().addClientActivity({
      id: `ca-${project.clientId}-project-${project.id}`,
      clientId: project.clientId,
      type: "milestone",
      title: "New project started",
      description: `${project.name} was created.`,
      who,
      when,
    });
  },
  updateProject: (id, patch) => {
    const before = get().projects.find((p) => p.id === id);
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    if (before && patch.status && patch.status !== before.status) {
      useActivityStore.getState().addProjectActivity({
        id: `pa-${id}-status-${Date.now()}`,
        projectId: id,
        who: getCurrentUser().name,
        what: `changed status to ${statusLabel[patch.status]}`,
        when: new Date().toISOString().slice(0, 10),
      });
    }
  },
}));
