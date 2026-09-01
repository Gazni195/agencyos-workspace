// Types & seed data for the Leads module.
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

// Note: account "owners" (who can be assigned a lead) come from the live
// employee directory, not a static seed array — see useEmployeesStore.
// Lead sources work the same way — see LeadFormDialog.tsx and
// reports.leads.tsx, both of which derive their own live source list from
// useLeadsStore rather than a static export here.
