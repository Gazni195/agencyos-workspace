// Client-side Leads/Pipeline state, backed by Supabase's `leads` and
// `lead_notes` tables (see supabase/migrations/0002_clients_and_leads.sql).
// Notes are a separate related table, fetched embedded via Supabase's
// nested select rather than as a JSON blob column.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { initialsOf, type Lead, type LeadNote, type LeadStage } from "@/data/crm";
import { type Client, type PackageType } from "@/data/crm";
import { useClientsStore } from "./clientsStore";
import { useActivityStore } from "./activityStore";
import { useInboxStore } from "./inboxStore";
import { getCurrentUser } from "@/hooks/useCurrentUser";

export type StoreLead = Lead & { convertedClientId?: string };

type LeadNoteRow = { id: string; author: string; written_on: string; text: string };
type LeadRow = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: LeadStage;
  value: number;
  owner: string;
  source: string;
  next_action: string;
  created_on: string;
  converted_client_id: string | null;
  lead_notes: LeadNoteRow[];
};

function noteFromRow(row: LeadNoteRow): LeadNote {
  return { id: row.id, author: row.author, when: row.written_on, text: row.text };
}

function fromRow(row: LeadRow): StoreLead {
  return {
    id: row.id,
    company: row.company,
    contact: row.contact,
    email: row.email,
    phone: row.phone,
    stage: row.stage,
    value: row.value,
    owner: row.owner,
    source: row.source,
    nextAction: row.next_action,
    createdOn: row.created_on,
    notes: (row.lead_notes ?? []).map(noteFromRow).sort((a, b) => b.when.localeCompare(a.when)),
    ...(row.converted_client_id ? { convertedClientId: row.converted_client_id } : {}),
  };
}

function toRow(lead: Partial<StoreLead>) {
  const row: Record<string, unknown> = {};
  if (lead.company !== undefined) row["company"] = lead.company;
  if (lead.contact !== undefined) row["contact"] = lead.contact;
  if (lead.email !== undefined) row["email"] = lead.email;
  if (lead.phone !== undefined) row["phone"] = lead.phone;
  if (lead.stage !== undefined) row["stage"] = lead.stage;
  if (lead.value !== undefined) row["value"] = lead.value;
  if (lead.owner !== undefined) row["owner"] = lead.owner;
  if (lead.source !== undefined) row["source"] = lead.source;
  if (lead.nextAction !== undefined) row["next_action"] = lead.nextAction;
  if (lead.createdOn !== undefined) row["created_on"] = lead.createdOn;
  if (lead.convertedClientId !== undefined) row["converted_client_id"] = lead.convertedClientId;
  return row;
}

export type NewLeadInput = Omit<StoreLead, "id" | "notes">;

type ConvertDetails = {
  industry: string;
  packageType: PackageType;
  packageName: string;
  packagePrice: number;
};

type LeadsState = {
  leads: StoreLead[];
  loaded: boolean;
  fetchLeads: () => Promise<void>;
  addLead: (lead: NewLeadInput) => Promise<StoreLead | null>;
  updateLead: (id: string, patch: Partial<StoreLead>) => Promise<void>;
  removeLead: (id: string) => Promise<void>;
  setStage: (id: string, stage: LeadStage) => Promise<void>;
  addNote: (id: string, note: Omit<LeadNote, "id">) => Promise<void>;
  convertToClient: (id: string, details: ConvertDetails) => Promise<Client | null>;
};

const LEAD_SELECT = "*, lead_notes(id, author, written_on, text)";

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  loaded: false,
  fetchLeads: async () => {
    const { data, error } = await supabase
      .from("leads")
      .select(LEAD_SELECT)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load leads", error);
      set({ loaded: true });
      return;
    }
    set({ leads: (data as LeadRow[]).map(fromRow), loaded: true });
  },
  addLead: async (lead) => {
    const { data, error } = await supabase
      .from("leads")
      .insert(toRow(lead))
      .select(LEAD_SELECT)
      .single();
    if (error || !data) {
      console.error("Failed to create lead", error);
      return null;
    }
    const created = fromRow(data as LeadRow);
    set((s) => ({ leads: [created, ...s.leads] }));
    useInboxStore.getState().addNotification({
      id: `nt-lead-${created.id}`,
      icon: "task",
      title: "New lead",
      detail: `${created.company} (${created.source}) was added to the pipeline.`,
      time: "Just now",
      read: false,
    });
    return created;
  },
  updateLead: async (id, patch) => {
    const { error } = await supabase.from("leads").update(toRow(patch)).eq("id", id);
    if (error) {
      console.error("Failed to update lead", error);
      return;
    }
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  },
  removeLead: async (id) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete lead", error);
      return;
    }
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) }));
  },
  setStage: async (id, stage) => {
    const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
    if (error) {
      console.error("Failed to update lead stage", error);
      return;
    }
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, stage } : l)) }));
  },
  addNote: async (id, note) => {
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: id, author: note.author, written_on: note.when, text: note.text })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to add lead note", error);
      return;
    }
    const created = noteFromRow(data as LeadNoteRow);
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, notes: [created, ...l.notes] } : l)),
    }));
  },
  convertToClient: async (id, details) => {
    const lead = get().leads.find((l) => l.id === id);
    if (!lead) return null;

    const created = await useClientsStore.getState().addClient({
      name: lead.company,
      industry: details.industry || "General",
      owner: lead.owner,
      mrr: details.packageType === "monthly" ? details.packagePrice : 0,
      health: "healthy",
      logo: initialsOf(lead.company),
      since: new Date().toISOString().slice(0, 10),
      address: "—",
      website: "—",
      notes: `Converted from lead ${lead.id} (${lead.source}). Primary contact: ${lead.contact}.`,
      packageType: details.packageType,
      packageName: details.packageName || "General",
      packagePrice: details.packagePrice,
    });
    if (!created) return null;

    useActivityStore.getState().addClientActivity({
      id: `ca-${created.id}-converted`,
      clientId: created.id,
      type: "milestone",
      title: "Converted from a lead",
      description: `Converted from lead "${lead.company}" (source: ${lead.source}).`,
      who: getCurrentUser().name,
      when: new Date().toISOString().slice(0, 10),
    });
    useInboxStore.getState().addNotification({
      id: `nt-lead-won-${lead.id}`,
      icon: "task",
      title: "Lead won",
      detail: `${lead.company} converted to a client.`,
      time: "Just now",
      read: false,
    });

    await get().updateLead(id, { stage: "Won", convertedClientId: created.id });
    return created;
  },
}));

export const useLead = (id: string) => useLeadsStore((s) => s.leads.find((l) => l.id === id));
