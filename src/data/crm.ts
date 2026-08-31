// CRM data layer for the Clients & Leads modules.
import { employees, money } from "@/data/agency";

export { money };

export type ClientHealth = "healthy" | "at-risk" | "churn-risk";

export type PackageType = "monthly" | "one-time";

export type Client = {
  id: string;
  name: string;
  industry: string;
  owner: string;
  mrr: number;
  health: ClientHealth;
  logo: string;
  since: string;
  address: string;
  website: string;
  notes: string;
  packageType: PackageType;
  packageName: string;
  packagePrice: number;
};

export const clients: Client[] = [];

export const clientById = (id: string) => clients.find((c) => c.id === id);

export type ClientContact = {
  id: string;
  clientId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  primary: boolean;
};

export const clientContacts: ClientContact[] = [];

export type Retainer = {
  id: string;
  clientId: string;
  name: string;
  monthlyValue: number;
  scope: string;
  startDate: string;
  renewalDate: string;
  status: "active" | "renewal-due" | "at-risk";
};

export const retainers: Retainer[] = [];

export type ClientActivityEvent = {
  id: string;
  clientId: string;
  type: "note" | "meeting" | "email" | "milestone" | "invoice";
  title: string;
  description: string;
  who: string;
  when: string;
};

export const clientActivity: ClientActivityEvent[] = [];

export type ClientDocument = {
  id: string;
  clientId: string;
  name: string;
  category: "Contract" | "Brief" | "Report" | "Creative" | "Invoice";
  size: string;
  uploadedOn: string;
};

export const clientDocuments: ClientDocument[] = [];

// ---------- Leads / CRM pipeline ----------

export type LeadStage =
  "New" | "Contacted" | "Meeting Scheduled" | "Proposal Sent" | "Negotiation" | "Won" | "Lost";

export const leadStages: LeadStage[] = [
  "New",
  "Contacted",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

export type LeadNote = { id: string; author: string; when: string; text: string };

export type Lead = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: LeadStage;
  value: number;
  owner: string;
  source: string;
  nextAction: string;
  createdOn: string;
  notes: LeadNote[];
};

export const leads: Lead[] = [];

export const leadStageColor: Record<LeadStage, string> = {
  New: "bg-muted text-muted-foreground",
  Contacted: "bg-info/12 text-info",
  "Meeting Scheduled": "bg-primary/12 text-primary",
  "Proposal Sent": "bg-warning/18 text-warning-foreground",
  Negotiation: "bg-warning/18 text-warning-foreground",
  Won: "bg-success/12 text-success",
  Lost: "bg-destructive/12 text-destructive",
};

// Note: account "owners" (who can be assigned a client/lead) come from the
// live employee directory, not this static seed array — see
// useEmployeesStore. Consumers should derive owner names from that store
// rather than importing a static list here, since employees are created at
// runtime, not seeded.
export const sources = Array.from(new Set(leads.map((l) => l.source)));

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const employeeAvatarInitials = (name: string) => {
  const emp = employees.find((e) => e.name === name);
  return emp?.initials ?? initialsOf(name);
};
