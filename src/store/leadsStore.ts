// Client-side Leads/Pipeline state. Seeded from src/data/crm.ts. Mutations
// (stage moves, notes, conversion to a client) live only in memory for this
// session — swap for API calls later without touching the UI layer.
import { create } from "zustand";
import {
  leads as seedLeads,
  initialsOf,
  type Lead,
  type LeadNote,
  type LeadStage,
} from "@/data/crm";
import { type Client, type PackageType } from "@/data/crm";
import { useClientsStore } from "./clientsStore";

export type StoreLead = Lead & { convertedClientId?: string };

type ConvertDetails = {
  industry: string;
  packageType: PackageType;
  packageName: string;
  packagePrice: number;
};

type LeadsState = {
  leads: StoreLead[];
  addLead: (lead: StoreLead) => void;
  updateLead: (id: string, patch: Partial<StoreLead>) => void;
  removeLead: (id: string) => void;
  setStage: (id: string, stage: LeadStage) => void;
  addNote: (id: string, note: LeadNote) => void;
  convertToClient: (id: string, details: ConvertDetails) => Client | undefined;
};

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: seedLeads,
  addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
  updateLead: (id, patch) =>
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
  removeLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
  setStage: (id, stage) =>
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })),
  addNote: (id, note) =>
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, notes: [note, ...l.notes] } : l)),
    })),
  convertToClient: (id, details) => {
    const lead = get().leads.find((l) => l.id === id);
    if (!lead) return undefined;

    const client: Client = {
      id: `cl-${Date.now()}`,
      name: lead.company,
      industry: details.industry || "General",
      owner: lead.owner,
      mrr: details.packageType === "monthly" ? details.packagePrice : 0,
      health: "healthy",
      projects: 0,
      logo: initialsOf(lead.company),
      since: new Date().toISOString().slice(0, 10),
      address: "—",
      website: "—",
      notes: `Converted from lead ${lead.id} (${lead.source}). Primary contact: ${lead.contact}.`,
      packageType: details.packageType,
      packageName: details.packageName || "General",
      packagePrice: details.packagePrice,
    };

    useClientsStore.getState().addClient(client);
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === id ? { ...l, stage: "Won", convertedClientId: client.id } : l,
      ),
    }));
    return client;
  },
}));

export const useLead = (id: string) => useLeadsStore((s) => s.leads.find((l) => l.id === id));
