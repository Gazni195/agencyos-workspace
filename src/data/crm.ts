// CRM data layer for the Clients & Leads modules — extends the base agency data set.
import { clients as baseClients, leads as baseLeads, employees, money } from "@/data/agency";

export { money };

export type ClientHealth = "healthy" | "at-risk" | "churn-risk";

export type Client = {
  id: string;
  name: string;
  industry: string;
  owner: string;
  mrr: number;
  health: ClientHealth;
  projects: number;
  logo: string;
  since: string;
  address: string;
  website: string;
  notes: string;
};

const industries = [
  "Retail",
  "Automotive",
  "Healthcare",
  "Fintech",
  "Apparel",
  "Hospitality",
  "SaaS",
  "CPG",
];

export const clients: Client[] = [
  ...baseClients.map((c, i) => ({
    ...c,
    health: c.health as ClientHealth,
    logo: c.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    since:
      ["2022-03-01", "2021-11-15", "2023-01-09", "2022-07-22", "2024-02-14"][i] ?? "2023-01-01",
    address:
      ["Portland, OR", "Detroit, MI", "Austin, TX", "New York, NY", "Denver, CO"][i] ?? "Remote",
    website: `https://${c.name.toLowerCase().replace(/\s+/g, "")}.com`,
    notes: "Long-standing account with quarterly business reviews.",
  })),
  {
    id: "cl-6",
    name: "Solace Wellness",
    industry: "Hospitality",
    owner: "Priya Nair",
    mrr: 15200,
    health: "healthy",
    projects: 2,
    logo: "SW",
    since: "2024-06-10",
    address: "Austin, TX",
    website: "https://solacewellness.com",
    notes: "Expanding into paid social this quarter.",
  },
  {
    id: "cl-7",
    name: "Pinnacle SaaS Co.",
    industry: "SaaS",
    owner: "Sofia Marchetti",
    mrr: 42000,
    health: "healthy",
    projects: 4,
    logo: "PS",
    since: "2023-09-01",
    address: "San Francisco, CA",
    website: "https://pinnaclesaas.com",
    notes: "Key strategic account, renewal locked through 2027.",
  },
];

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

export const clientContacts: ClientContact[] = [
  {
    id: "cc-1",
    clientId: "cl-1",
    name: "Rosa Delgado",
    role: "VP Marketing",
    email: "rosa@northwindcoffee.com",
    phone: "+1 (503) 555-0142",
    primary: true,
  },
  {
    id: "cc-2",
    clientId: "cl-1",
    name: "Ben Halloway",
    role: "Brand Manager",
    email: "ben@northwindcoffee.com",
    phone: "+1 (503) 555-0198",
    primary: false,
  },
  {
    id: "cc-3",
    clientId: "cl-2",
    name: "Grace Lindqvist",
    role: "CMO",
    email: "grace@voltamotors.com",
    phone: "+1 (313) 555-0110",
    primary: true,
  },
  {
    id: "cc-4",
    clientId: "cl-2",
    name: "Owen Marsh",
    role: "Media Director",
    email: "owen@voltamotors.com",
    phone: "+1 (313) 555-0187",
    primary: false,
  },
  {
    id: "cc-5",
    clientId: "cl-3",
    name: "Dr. Alicia Reyes",
    role: "Director of Comms",
    email: "alicia@heliohealth.com",
    phone: "+1 (512) 555-0155",
    primary: true,
  },
  {
    id: "cc-6",
    clientId: "cl-4",
    name: "Marcus Feld",
    role: "Head of Growth",
    email: "marcus@lumenfinance.com",
    phone: "+1 (212) 555-0129",
    primary: true,
  },
  {
    id: "cc-7",
    clientId: "cl-5",
    name: "Talia Osei",
    role: "Founder",
    email: "talia@terraoutdoor.com",
    phone: "+1 (720) 555-0167",
    primary: true,
  },
  {
    id: "cc-8",
    clientId: "cl-6",
    name: "Nate Fournier",
    role: "Marketing Lead",
    email: "nate@solacewellness.com",
    phone: "+1 (737) 555-0121",
    primary: true,
  },
  {
    id: "cc-9",
    clientId: "cl-7",
    name: "Devi Prakash",
    role: "VP Demand Gen",
    email: "devi@pinnaclesaas.com",
    phone: "+1 (415) 555-0133",
    primary: true,
  },
  {
    id: "cc-10",
    clientId: "cl-7",
    name: "Sam Chu",
    role: "Product Marketing",
    email: "sam@pinnaclesaas.com",
    phone: "+1 (415) 555-0177",
    primary: false,
  },
];

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

export const retainers: Retainer[] = [
  {
    id: "rt-1",
    clientId: "cl-1",
    name: "Brand & Content Retainer",
    monthlyValue: 14000,
    scope: "Brand strategy, content production, social management",
    startDate: "2022-03-01",
    renewalDate: "2026-12-31",
    status: "active",
  },
  {
    id: "rt-2",
    clientId: "cl-1",
    name: "Content Engine",
    monthlyValue: 10000,
    scope: "Editorial calendar, blog, newsletter",
    startDate: "2024-01-15",
    renewalDate: "2026-10-15",
    status: "renewal-due",
  },
  {
    id: "rt-3",
    clientId: "cl-2",
    name: "Paid Media Management",
    monthlyValue: 38000,
    scope: "Paid social, search, programmatic display",
    startDate: "2021-11-15",
    renewalDate: "2027-01-31",
    status: "active",
  },
  {
    id: "rt-4",
    clientId: "cl-2",
    name: "Creative Production",
    monthlyValue: 20000,
    scope: "Video, motion, campaign assets",
    startDate: "2023-04-01",
    renewalDate: "2026-11-01",
    status: "active",
  },
  {
    id: "rt-5",
    clientId: "cl-3",
    name: "Website & CRO Retainer",
    monthlyValue: 31000,
    scope: "Website rebuild, CRO testing, analytics",
    startDate: "2023-01-09",
    renewalDate: "2026-09-20",
    status: "at-risk",
  },
  {
    id: "rt-6",
    clientId: "cl-4",
    name: "Growth Marketing",
    monthlyValue: 19500,
    scope: "Paid search, lifecycle email, reporting",
    startDate: "2022-07-22",
    renewalDate: "2027-02-28",
    status: "active",
  },
  {
    id: "rt-7",
    clientId: "cl-5",
    name: "Brand Partnerships",
    monthlyValue: 12500,
    scope: "Influencer, affiliate, seasonal campaigns",
    startDate: "2024-02-14",
    renewalDate: "2026-09-30",
    status: "renewal-due",
  },
  {
    id: "rt-8",
    clientId: "cl-6",
    name: "Social & Community",
    monthlyValue: 15200,
    scope: "Organic social, community management",
    startDate: "2024-06-10",
    renewalDate: "2027-06-10",
    status: "active",
  },
  {
    id: "rt-9",
    clientId: "cl-7",
    name: "Full-Funnel Demand Gen",
    monthlyValue: 42000,
    scope: "Paid, SEO, ABM, lifecycle",
    startDate: "2023-09-01",
    renewalDate: "2027-09-01",
    status: "active",
  },
];

export type ClientActivityEvent = {
  id: string;
  clientId: string;
  type: "note" | "meeting" | "email" | "milestone" | "invoice";
  title: string;
  description: string;
  who: string;
  when: string;
};

export const clientActivity: ClientActivityEvent[] = [
  {
    id: "ca-1",
    clientId: "cl-1",
    type: "meeting",
    title: "Quarterly business review",
    description: "Reviewed Q3 performance and content roadmap.",
    who: "Sofia Marchetti",
    when: "2026-08-20",
  },
  {
    id: "ca-2",
    clientId: "cl-1",
    type: "milestone",
    title: "Brand Refresh key visuals approved",
    description: "Round 3 visuals signed off by Rosa Delgado.",
    who: "Amara Okafor",
    when: "2026-08-18",
  },
  {
    id: "ca-3",
    clientId: "cl-1",
    type: "invoice",
    title: "August invoice sent",
    description: "$24,000 retainer invoice sent, due Sep 15.",
    who: "Finance",
    when: "2026-08-01",
  },
  {
    id: "ca-4",
    clientId: "cl-2",
    type: "email",
    title: "Budget approval thread",
    description: "Priya confirmed Q3 media budget increase.",
    who: "Priya Nair",
    when: "2026-08-26",
  },
  {
    id: "ca-5",
    clientId: "cl-2",
    type: "meeting",
    title: "Launch film review",
    description: "Final color grade presented to Grace Lindqvist.",
    who: "Noah Feldman",
    when: "2026-08-22",
  },
  {
    id: "ca-6",
    clientId: "cl-3",
    type: "note",
    title: "Timeline slipping on website rebuild",
    description: "Flagged as at-risk; escalation call scheduled.",
    who: "Marcus Doyle",
    when: "2026-08-25",
  },
  {
    id: "ca-7",
    clientId: "cl-3",
    type: "meeting",
    title: "Sprint review",
    description: "Walked through component library progress.",
    who: "Liam Bennett",
    when: "2026-08-19",
  },
  {
    id: "ca-8",
    clientId: "cl-4",
    type: "milestone",
    title: "Growth retainer renewed",
    description: "Signed 12-month renewal at current rate.",
    who: "Sofia Marchetti",
    when: "2026-07-30",
  },
  {
    id: "ca-9",
    clientId: "cl-5",
    type: "note",
    title: "Churn risk flagged",
    description: "Talia raised concerns about campaign ROI.",
    who: "Marcus Doyle",
    when: "2026-08-15",
  },
  {
    id: "ca-10",
    clientId: "cl-6",
    type: "email",
    title: "Kickoff recap sent",
    description: "Shared onboarding recap and content calendar.",
    who: "Priya Nair",
    when: "2026-06-12",
  },
  {
    id: "ca-11",
    clientId: "cl-7",
    type: "meeting",
    title: "ABM strategy workshop",
    description: "Aligned on target account list for H2.",
    who: "Sofia Marchetti",
    when: "2026-08-10",
  },
];

export type ClientDocument = {
  id: string;
  clientId: string;
  name: string;
  category: "Contract" | "Brief" | "Report" | "Creative" | "Invoice";
  size: string;
  uploadedOn: string;
};

export const clientDocuments: ClientDocument[] = [
  {
    id: "cd-1",
    clientId: "cl-1",
    name: "Master Services Agreement.pdf",
    category: "Contract",
    size: "540 KB",
    uploadedOn: "2022-03-01",
  },
  {
    id: "cd-2",
    clientId: "cl-1",
    name: "Brand Refresh Creative Brief.pdf",
    category: "Brief",
    size: "212 KB",
    uploadedOn: "2026-05-10",
  },
  {
    id: "cd-3",
    clientId: "cl-1",
    name: "Q2 Performance Report.pdf",
    category: "Report",
    size: "1.1 MB",
    uploadedOn: "2026-07-05",
  },
  {
    id: "cd-4",
    clientId: "cl-2",
    name: "Media Retainer SOW.pdf",
    category: "Contract",
    size: "398 KB",
    uploadedOn: "2021-11-15",
  },
  {
    id: "cd-5",
    clientId: "cl-2",
    name: "Launch Film Storyboard.pdf",
    category: "Creative",
    size: "3.4 MB",
    uploadedOn: "2026-06-18",
  },
  {
    id: "cd-6",
    clientId: "cl-3",
    name: "Website Rebuild SOW.pdf",
    category: "Contract",
    size: "455 KB",
    uploadedOn: "2023-01-09",
  },
  {
    id: "cd-7",
    clientId: "cl-3",
    name: "August Invoice.pdf",
    category: "Invoice",
    size: "88 KB",
    uploadedOn: "2026-08-01",
  },
  {
    id: "cd-8",
    clientId: "cl-4",
    name: "Growth Marketing MSA.pdf",
    category: "Contract",
    size: "310 KB",
    uploadedOn: "2022-07-22",
  },
  {
    id: "cd-9",
    clientId: "cl-7",
    name: "ABM Strategy Deck.pdf",
    category: "Brief",
    size: "2.2 MB",
    uploadedOn: "2026-08-10",
  },
];

// ---------- Leads / CRM pipeline ----------

export type LeadStage =
  "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";

export const leadStages: LeadStage[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
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

const stageMap: Record<string, LeadStage> = {
  Discovery: "Qualified",
  Proposal: "Proposal",
  Negotiation: "Negotiation",
};

export const leads: Lead[] = [
  ...baseLeads.map((l, i) => ({
    id: l.id,
    company: l.company,
    contact: l.contact,
    email: `${l.contact.toLowerCase().replace(/\s+/g, ".")}@${l.company.toLowerCase().replace(/\s+/g, "")}.com`,
    phone: `+1 (${400 + i * 11}) 555-0${100 + i}`,
    stage: stageMap[l.stage] ?? "New",
    value: l.value,
    owner: l.owner,
    source: l.source,
    nextAction: ["2026-09-02", "2026-09-05", "2026-09-08", "2026-09-10"][i] ?? "2026-09-12",
    createdOn: ["2026-07-14", "2026-08-01", "2026-06-20", "2026-08-10"][i] ?? "2026-08-01",
    notes: [
      {
        id: `n-${l.id}-1`,
        author: l.owner,
        when: "2026-08-20",
        text: "Initial discovery call went well.",
      },
    ],
  })),
  {
    id: "ld-5",
    company: "Cobalt Retail Group",
    contact: "Nina Choudhury",
    email: "nina.choudhury@cobaltretail.com",
    phone: "+1 (212) 555-0301",
    stage: "New",
    value: 54000,
    owner: "Marcus Doyle",
    source: "Inbound",
    nextAction: "2026-09-03",
    createdOn: "2026-08-28",
    notes: [],
  },
  {
    id: "ld-6",
    company: "Pinehurst Realty",
    contact: "Jack Okonkwo",
    email: "jack.okonkwo@pinehurstrealty.com",
    phone: "+1 (704) 555-0142",
    stage: "New",
    value: 38000,
    owner: "Priya Nair",
    source: "Referral",
    nextAction: "2026-09-04",
    createdOn: "2026-08-27",
    notes: [],
  },
  {
    id: "ld-7",
    company: "Fernwood Beverages",
    contact: "Lucia Marin",
    email: "lucia.marin@fernwoodbev.com",
    phone: "+1 (503) 555-0188",
    stage: "Contacted",
    value: 71000,
    owner: "Marcus Doyle",
    source: "Event",
    nextAction: "2026-09-06",
    createdOn: "2026-08-15",
    notes: [
      {
        id: "n-ld7-1",
        author: "Marcus Doyle",
        when: "2026-08-22",
        text: "Sent intro email and case studies.",
      },
    ],
  },
  {
    id: "ld-8",
    company: "Harbor Fitness",
    contact: "Derek Vance",
    email: "derek.vance@harborfitness.com",
    phone: "+1 (617) 555-0176",
    stage: "Contacted",
    value: 26000,
    owner: "Priya Nair",
    source: "Outbound",
    nextAction: "2026-09-05",
    createdOn: "2026-08-12",
    notes: [
      {
        id: "n-ld8-1",
        author: "Priya Nair",
        when: "2026-08-19",
        text: "Left voicemail, following up Friday.",
      },
    ],
  },
  {
    id: "ld-9",
    company: "Meridian Legal",
    contact: "Priya Batra",
    email: "priya.batra@meridianlegal.com",
    phone: "+1 (312) 555-0122",
    stage: "Qualified",
    value: 89000,
    owner: "Sofia Marchetti",
    source: "Referral",
    nextAction: "2026-09-07",
    createdOn: "2026-07-28",
    notes: [
      {
        id: "n-ld9-1",
        author: "Sofia Marchetti",
        when: "2026-08-14",
        text: "Budget confirmed, scoping full-funnel proposal.",
      },
    ],
  },
  {
    id: "ld-10",
    company: "Bluepeak Insurance",
    contact: "Harold Vinter",
    email: "harold.vinter@bluepeakins.com",
    phone: "+1 (206) 555-0193",
    stage: "Proposal",
    value: 118000,
    owner: "Marcus Doyle",
    source: "Inbound",
    nextAction: "2026-09-09",
    createdOn: "2026-07-10",
    notes: [
      {
        id: "n-ld10-1",
        author: "Marcus Doyle",
        when: "2026-08-25",
        text: "Proposal sent, awaiting procurement review.",
      },
    ],
  },
  {
    id: "ld-11",
    company: "Willow & Ash Home",
    contact: "Cara Dunmore",
    email: "cara.dunmore@willowash.com",
    phone: "+1 (503) 555-0166",
    stage: "Negotiation",
    value: 56000,
    owner: "Priya Nair",
    source: "Outbound",
    nextAction: "2026-09-04",
    createdOn: "2026-06-30",
    notes: [
      {
        id: "n-ld11-1",
        author: "Priya Nair",
        when: "2026-08-24",
        text: "Negotiating scope down to fit Q4 budget.",
      },
    ],
  },
  {
    id: "ld-12",
    company: "Sable & Finch Media",
    contact: "Owen Petrakis",
    email: "owen.petrakis@sablefinch.com",
    phone: "+1 (212) 555-0209",
    stage: "Won",
    value: 76000,
    owner: "Sofia Marchetti",
    source: "Referral",
    nextAction: "2026-09-15",
    createdOn: "2026-06-01",
    notes: [
      {
        id: "n-ld12-1",
        author: "Sofia Marchetti",
        when: "2026-08-05",
        text: "Contract signed, kickoff scheduled.",
      },
    ],
  },
  {
    id: "ld-13",
    company: "Copperline Logistics",
    contact: "Vera Sundqvist",
    email: "vera.sundqvist@copperline.com",
    phone: "+1 (773) 555-0144",
    stage: "Won",
    value: 63000,
    owner: "Marcus Doyle",
    source: "Event",
    nextAction: "2026-09-12",
    createdOn: "2026-05-20",
    notes: [
      {
        id: "n-ld13-1",
        author: "Marcus Doyle",
        when: "2026-08-01",
        text: "Closed-won, onboarding call booked.",
      },
    ],
  },
  {
    id: "ld-14",
    company: "Northstar Outfitters",
    contact: "Miles Andersen",
    email: "miles.andersen@northstarout.com",
    phone: "+1 (720) 555-0155",
    stage: "Lost",
    value: 41000,
    owner: "Priya Nair",
    source: "Inbound",
    nextAction: "—",
    createdOn: "2026-06-15",
    notes: [
      {
        id: "n-ld14-1",
        author: "Priya Nair",
        when: "2026-07-20",
        text: "Went with a competitor on price.",
      },
    ],
  },
];

export const leadStageColor: Record<LeadStage, string> = {
  New: "bg-muted text-muted-foreground",
  Contacted: "bg-info/12 text-info",
  Qualified: "bg-primary/12 text-primary",
  Proposal: "bg-warning/18 text-warning-foreground",
  Negotiation: "bg-warning/18 text-warning-foreground",
  Won: "bg-success/12 text-success",
  Lost: "bg-destructive/12 text-destructive",
};

export const owners = Array.from(
  new Set([...clients.map((c) => c.owner), ...leads.map((l) => l.owner)]),
);
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
