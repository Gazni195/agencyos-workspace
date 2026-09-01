// Client-side CRM state. Seeded from the mock data layer (src/data/crm.ts);
// mutations live only in memory for this session. When ERPNext is wired up,
// these actions become the natural place to swap in API calls without the
// UI layer changing.
import { create } from "zustand";
import { clients as seedClients, type Client } from "@/modules/clients/types";
import { useActivityStore } from "@/shared/frontend/store/activityStore";
import { getCurrentUser } from "@/shared/frontend/hooks/useCurrentUser";

type ClientsState = {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: seedClients,
  addClient: (client) => {
    set((s) => ({ clients: [client, ...s.clients] }));
    useActivityStore.getState().addClientActivity({
      id: `ca-${client.id}-added`,
      clientId: client.id,
      type: "milestone",
      title: "Added to the workspace",
      description: `${client.name} was added as a new client.`,
      who: getCurrentUser().name,
      when: new Date().toISOString().slice(0, 10),
    });
  },
  updateClient: (id, patch) =>
    set((s) => ({
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  removeClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
}));

export const useClient = (id: string) => useClientsStore((s) => s.clients.find((c) => c.id === id));
