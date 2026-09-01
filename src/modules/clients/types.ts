// Types & seed data for the Clients module.
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

export type ClientDocument = {
  id: string;
  clientId: string;
  name: string;
  category: "Contract" | "Brief" | "Report" | "Creative" | "Invoice";
  size: string;
  uploadedOn: string;
};

export const clientDocuments: ClientDocument[] = [];
