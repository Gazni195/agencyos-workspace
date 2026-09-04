// Client-side Projects state, backed by Supabase's `projects` table (see
// supabase/migrations/0004_projects_and_tasks.sql). Team/lead references stay
// plain text/employee-id strings rather than real foreign keys, since the
// Employees module isn't backed by Supabase yet.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { type DeliveryProject, type ProjectStatus } from "@/data/delivery";
import { useActivityStore } from "./activityStore";
import { getCurrentUser } from "@/hooks/useCurrentUser";

const statusLabel: Record<ProjectStatus, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  delayed: "Delayed",
  completed: "Completed",
};

type ProjectRow = {
  id: string;
  name: string;
  client_id: string;
  lead: string;
  lead_initials: string;
  team: string[];
  progress: number;
  budget: number;
  spend: number;
  status: ProjectStatus;
  start_date: string;
  due: string;
  description: string;
  health: DeliveryProject["health"];
};

function fromRow(row: ProjectRow): DeliveryProject {
  return {
    id: row.id,
    name: row.name,
    clientId: row.client_id,
    lead: row.lead,
    leadInitials: row.lead_initials,
    team: row.team,
    progress: row.progress,
    budget: row.budget,
    spend: row.spend,
    status: row.status,
    startDate: row.start_date,
    due: row.due,
    description: row.description,
    health: row.health,
  };
}

function toRow(project: Partial<DeliveryProject>) {
  const row: Record<string, unknown> = {};
  if (project.name !== undefined) row["name"] = project.name;
  if (project.clientId !== undefined) row["client_id"] = project.clientId;
  if (project.lead !== undefined) row["lead"] = project.lead;
  if (project.leadInitials !== undefined) row["lead_initials"] = project.leadInitials;
  if (project.team !== undefined) row["team"] = project.team;
  if (project.progress !== undefined) row["progress"] = project.progress;
  if (project.budget !== undefined) row["budget"] = project.budget;
  if (project.spend !== undefined) row["spend"] = project.spend;
  if (project.status !== undefined) row["status"] = project.status;
  if (project.startDate !== undefined) row["start_date"] = project.startDate;
  if (project.due !== undefined) row["due"] = project.due;
  if (project.description !== undefined) row["description"] = project.description;
  if (project.health !== undefined) row["health"] = project.health;
  return row;
}

export type NewProjectInput = Omit<DeliveryProject, "id">;

type ProjectsState = {
  projects: DeliveryProject[];
  loaded: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: NewProjectInput) => Promise<DeliveryProject | null>;
  updateProject: (id: string, patch: Partial<DeliveryProject>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
};

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loaded: false,
  fetchProjects: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load projects", error);
      set({ loaded: true });
      return;
    }
    set({ projects: (data as ProjectRow[]).map(fromRow), loaded: true });
  },
  addProject: async (project) => {
    const { data, error } = await supabase
      .from("projects")
      .insert(toRow(project))
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create project", error);
      return null;
    }
    const created = fromRow(data as ProjectRow);
    set((s) => ({ projects: [created, ...s.projects] }));
    const who = getCurrentUser().name;
    const when = new Date().toISOString().slice(0, 10);
    useActivityStore.getState().addProjectActivity({
      id: `pa-${created.id}-created`,
      projectId: created.id,
      who,
      what: "created this project",
      when,
    });
    useActivityStore.getState().addClientActivity({
      id: `ca-${created.clientId}-project-${created.id}`,
      clientId: created.clientId,
      type: "milestone",
      title: "New project started",
      description: `${created.name} was created.`,
      who,
      when,
    });
    return created;
  },
  updateProject: async (id, patch) => {
    const before = get().projects.find((p) => p.id === id);
    const { error } = await supabase.from("projects").update(toRow(patch)).eq("id", id);
    if (error) {
      console.error("Failed to update project", error);
      return;
    }
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
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
  removeProject: async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete project", error);
      return;
    }
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },
}));

export const useProject = (id: string) =>
  useProjectsStore((s) => s.projects.find((p) => p.id === id));
