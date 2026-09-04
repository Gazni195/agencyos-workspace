// Client-side CRM state, backed by Supabase's `clients` table (see
// supabase/migrations/0002_clients_and_leads.sql). fetchClients() loads the
// real rows — gated by Row Level Security on the signed-in account's role,
// same rule as everywhere else — and the actions below write straight
// through to Postgres instead of holding local seed data.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import type { Client } from "@/data/crm";
import { useActivityStore } from "./activityStore";
import { getCurrentUser } from "@/hooks/useCurrentUser";

type ClientRow = {
  id: string;
  name: string;
  industry: string;
  owner: string;
  mrr: number;
  health: Client["health"];
  logo: string;
  since: string;
  address: string;
  website: string;
  notes: string;
  package_type: Client["packageType"];
  package_name: string;
  package_price: number;
};

function fromRow(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    owner: row.owner,
    mrr: row.mrr,
    health: row.health,
    logo: row.logo,
    since: row.since,
    address: row.address,
    website: row.website,
    notes: row.notes,
    packageType: row.package_type,
    packageName: row.package_name,
    packagePrice: row.package_price,
  };
}

function toRow(client: Partial<Client>) {
  const row: Record<string, unknown> = {};
  if (client.name !== undefined) row["name"] = client.name;
  if (client.industry !== undefined) row["industry"] = client.industry;
  if (client.owner !== undefined) row["owner"] = client.owner;
  if (client.mrr !== undefined) row["mrr"] = client.mrr;
  if (client.health !== undefined) row["health"] = client.health;
  if (client.logo !== undefined) row["logo"] = client.logo;
  if (client.since !== undefined) row["since"] = client.since;
  if (client.address !== undefined) row["address"] = client.address;
  if (client.website !== undefined) row["website"] = client.website;
  if (client.notes !== undefined) row["notes"] = client.notes;
  if (client.packageType !== undefined) row["package_type"] = client.packageType;
  if (client.packageName !== undefined) row["package_name"] = client.packageName;
  if (client.packagePrice !== undefined) row["package_price"] = client.packagePrice;
  return row;
}

export type NewClientInput = Omit<Client, "id">;

type ClientsState = {
  clients: Client[];
  loaded: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: NewClientInput) => Promise<Client | null>;
  updateClient: (id: string, patch: Partial<Client>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  loaded: false,
  fetchClients: async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load clients", error);
      set({ loaded: true });
      return;
    }
    set({ clients: (data as ClientRow[]).map(fromRow), loaded: true });
  },
  addClient: async (client) => {
    const { data, error } = await supabase.from("clients").insert(toRow(client)).select().single();
    if (error || !data) {
      console.error("Failed to create client", error);
      return null;
    }
    const created = fromRow(data as ClientRow);
    set((s) => ({ clients: [created, ...s.clients] }));
    useActivityStore.getState().addClientActivity({
      id: `ca-${created.id}-added`,
      clientId: created.id,
      type: "milestone",
      title: "Added to the workspace",
      description: `${created.name} was added as a new client.`,
      who: getCurrentUser().name,
      when: new Date().toISOString().slice(0, 10),
    });
    return created;
  },
  updateClient: async (id, patch) => {
    const { error } = await supabase.from("clients").update(toRow(patch)).eq("id", id);
    if (error) {
      console.error("Failed to update client", error);
      return;
    }
    set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  },
  removeClient: async (id) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete client", error);
      return;
    }
    set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
  },
}));

export const useClient = (id: string) => useClientsStore((s) => s.clients.find((c) => c.id === id));
