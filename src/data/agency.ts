// Sample data layer for AgencyOS.
// Structured to mirror future Supabase tables — swap these arrays for queries later.

export type EmployeeStatus = "active" | "on-leave" | "probation" | "offboarding";

export type Employee = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: "Creative" | "Media" | "Strategy" | "Engineering" | "Operations" | "Sales";
  email: string;
  phone: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  status: EmployeeStatus;
  manager: string;
  joinedOn: string;
  salary: number;
  utilization: number;
  leaveBalance: number;
  skills: string[];
};

export const employees: Employee[] = [
  {
    id: "emp-1001",
    name: "Amara Okafor",
    initials: "AO",
    role: "Creative Director",
    department: "Creative",
    email: "amara.okafor@agencyos.co",
    phone: "+1 (415) 220-8841",
    location: "San Francisco, US",
    employmentType: "Full-time",
    status: "active",
    manager: "Daniel Reyes",
    joinedOn: "2021-03-15",
    salary: 142000,
    utilization: 86,
    leaveBalance: 12,
    skills: ["Art Direction", "Brand Systems", "Campaign Concepting"],
  },
  {
    id: "emp-1002",
    name: "Kenji Tanaka",
    initials: "KT",
    role: "Senior Media Buyer",
    department: "Media",
    email: "kenji.tanaka@agencyos.co",
    phone: "+1 (312) 448-1120",
    location: "Chicago, US",
    employmentType: "Full-time",
    status: "active",
    manager: "Priya Nair",
    joinedOn: "2022-01-10",
    salary: 108000,
    utilization: 92,
    leaveBalance: 8,
    skills: ["Paid Social", "Google Ads", "Attribution"],
  },
  {
    id: "emp-1003",
    name: "Sofia Marchetti",
    initials: "SM",
    role: "Account Strategist",
    department: "Strategy",
    email: "sofia.marchetti@agencyos.co",
    phone: "+39 340 118 2299",
    location: "Milan, IT",
    employmentType: "Full-time",
    status: "on-leave",
    manager: "Daniel Reyes",
    joinedOn: "2020-08-03",
    salary: 96000,
    utilization: 64,
    leaveBalance: 3,
    skills: ["Client Strategy", "Research", "Workshops"],
  },
  {
    id: "emp-1004",
    name: "Liam Bennett",
    initials: "LB",
    role: "Frontend Engineer",
    department: "Engineering",
    email: "liam.bennett@agencyos.co",
    phone: "+44 7700 900321",
    location: "London, UK",
    employmentType: "Full-time",
    status: "active",
    manager: "Nadia Haddad",
    joinedOn: "2023-05-22",
    salary: 101000,
    utilization: 78,
    leaveBalance: 15,
    skills: ["React", "Design Systems", "Webflow"],
  },
  {
    id: "emp-1005",
    name: "Priya Nair",
    initials: "PN",
    role: "Head of Media",
    department: "Media",
    email: "priya.nair@agencyos.co",
    phone: "+1 (646) 771-0092",
    location: "New York, US",
    employmentType: "Full-time",
    status: "active",
    manager: "Daniel Reyes",
    joinedOn: "2019-11-04",
    salary: 158000,
    utilization: 71,
    leaveBalance: 19,
    skills: ["Media Planning", "Budgeting", "Team Leadership"],
  },
  {
    id: "emp-1006",
    name: "Noah Feldman",
    initials: "NF",
    role: "Motion Designer",
    department: "Creative",
    email: "noah.feldman@agencyos.co",
    phone: "+1 (503) 220-7745",
    location: "Portland, US",
    employmentType: "Contract",
    status: "probation",
    manager: "Amara Okafor",
    joinedOn: "2026-06-01",
    salary: 74000,
    utilization: 88,
    leaveBalance: 4,
    skills: ["After Effects", "3D", "Storyboarding"],
  },
  {
    id: "emp-1007",
    name: "Ivy Chen",
    initials: "IC",
    role: "Operations Manager",
    department: "Operations",
    email: "ivy.chen@agencyos.co",
    phone: "+1 (206) 335-9912",
    location: "Seattle, US",
    employmentType: "Full-time",
    status: "active",
    manager: "Daniel Reyes",
    joinedOn: "2021-09-13",
    salary: 99000,
    utilization: 69,
    leaveBalance: 11,
    skills: ["Resourcing", "Process", "Vendor Mgmt"],
  },
  {
    id: "emp-1008",
    name: "Marcus Doyle",
    initials: "MD",
    role: "New Business Lead",
    department: "Sales",
    email: "marcus.doyle@agencyos.co",
    phone: "+1 (917) 442-6620",
    location: "New York, US",
    employmentType: "Full-time",
    status: "active",
    manager: "Daniel Reyes",
    joinedOn: "2022-02-28",
    salary: 118000,
    utilization: 74,
    leaveBalance: 7,
    skills: ["Pitching", "CRM", "Partnerships"],
  },
  {
    id: "emp-1009",
    name: "Fatima Zahra",
    initials: "FZ",
    role: "Content Strategist",
    department: "Strategy",
    email: "fatima.zahra@agencyos.co",
    phone: "+212 661 220 884",
    location: "Casablanca, MA",
    employmentType: "Part-time",
    status: "active",
    manager: "Sofia Marchetti",
    joinedOn: "2024-04-08",
    salary: 62000,
    utilization: 55,
    leaveBalance: 9,
    skills: ["SEO", "Editorial", "Localization"],
  },
  {
    id: "emp-1010",
    name: "Diego Alvarez",
    initials: "DA",
    role: "Backend Engineer",
    department: "Engineering",
    email: "diego.alvarez@agencyos.co",
    phone: "+34 611 220 774",
    location: "Barcelona, ES",
    employmentType: "Full-time",
    status: "offboarding",
    manager: "Nadia Haddad",
    joinedOn: "2020-02-17",
    salary: 112000,
    utilization: 41,
    leaveBalance: 2,
    skills: ["Node", "Postgres", "Integrations"],
  },
];

export const departments = [
  "Creative",
  "Media",
  "Strategy",
  "Engineering",
  "Operations",
  "Sales",
] as const;

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  status: "present" | "late" | "remote" | "absent";
};

export const attendance: AttendanceRecord[] = [
  {
    id: "att-1",
    employeeId: "emp-1001",
    date: "2026-08-28",
    clockIn: "09:02",
    clockOut: "18:10",
    hours: 8.6,
    status: "present",
  },
  {
    id: "att-2",
    employeeId: "emp-1002",
    date: "2026-08-28",
    clockIn: "09:41",
    clockOut: "18:30",
    hours: 8.2,
    status: "late",
  },
  {
    id: "att-3",
    employeeId: "emp-1004",
    date: "2026-08-28",
    clockIn: "08:50",
    clockOut: "17:40",
    hours: 8.4,
    status: "remote",
  },
  {
    id: "att-4",
    employeeId: "emp-1003",
    date: "2026-08-28",
    clockIn: "—",
    clockOut: "—",
    hours: 0,
    status: "absent",
  },
  {
    id: "att-5",
    employeeId: "emp-1005",
    date: "2026-08-28",
    clockIn: "08:35",
    clockOut: "17:55",
    hours: 8.8,
    status: "present",
  },
  {
    id: "att-6",
    employeeId: "emp-1006",
    date: "2026-08-28",
    clockIn: "10:05",
    clockOut: "19:00",
    hours: 8.3,
    status: "late",
  },
  {
    id: "att-7",
    employeeId: "emp-1007",
    date: "2026-08-28",
    clockIn: "09:00",
    clockOut: "17:30",
    hours: 8.0,
    status: "present",
  },
  {
    id: "att-8",
    employeeId: "emp-1008",
    date: "2026-08-28",
    clockIn: "09:12",
    clockOut: "18:02",
    hours: 8.3,
    status: "remote",
  },
  {
    id: "att-9",
    employeeId: "emp-1009",
    date: "2026-08-28",
    clockIn: "13:00",
    clockOut: "17:10",
    hours: 4.1,
    status: "present",
  },
  {
    id: "att-10",
    employeeId: "emp-1010",
    date: "2026-08-28",
    clockIn: "09:30",
    clockOut: "16:20",
    hours: 6.5,
    status: "present",
  },
];

export const attendanceTrend = [
  { day: "Mon", present: 42, remote: 11, absent: 3 },
  { day: "Tue", present: 45, remote: 9, absent: 2 },
  { day: "Wed", present: 40, remote: 13, absent: 3 },
  { day: "Thu", present: 44, remote: 10, absent: 2 },
  { day: "Fri", present: 33, remote: 19, absent: 4 },
];

export type LeaveRequest = {
  id: string;
  employeeId: string;
  type: "Annual" | "Sick" | "Parental" | "Unpaid" | "Study";
  from: string;
  to: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
};

export const leaveRequests: LeaveRequest[] = [
  {
    id: "lv-1",
    employeeId: "emp-1003",
    type: "Parental",
    from: "2026-08-10",
    to: "2026-10-02",
    days: 40,
    status: "approved",
    reason: "Parental leave",
  },
  {
    id: "lv-2",
    employeeId: "emp-1002",
    type: "Annual",
    from: "2026-09-07",
    to: "2026-09-11",
    days: 5,
    status: "pending",
    reason: "Family trip",
  },
  {
    id: "lv-3",
    employeeId: "emp-1006",
    type: "Sick",
    from: "2026-08-25",
    to: "2026-08-26",
    days: 2,
    status: "approved",
    reason: "Flu",
  },
  {
    id: "lv-4",
    employeeId: "emp-1009",
    type: "Study",
    from: "2026-09-15",
    to: "2026-09-16",
    days: 2,
    status: "pending",
    reason: "SEO certification",
  },
  {
    id: "lv-5",
    employeeId: "emp-1008",
    type: "Annual",
    from: "2026-10-01",
    to: "2026-10-08",
    days: 6,
    status: "pending",
    reason: "Vacation",
  },
  {
    id: "lv-6",
    employeeId: "emp-1010",
    type: "Unpaid",
    from: "2026-08-18",
    to: "2026-08-20",
    days: 3,
    status: "rejected",
    reason: "Personal",
  },
];

export type PayrollRun = {
  id: string;
  employeeId: string;
  period: string;
  base: number;
  bonus: number;
  deductions: number;
  net: number;
  status: "paid" | "processing" | "on-hold";
};

export const payroll: PayrollRun[] = employees.map((e, i) => {
  const base = Math.round(e.salary / 12);
  const bonus = i % 3 === 0 ? 1200 : i % 4 === 0 ? 800 : 0;
  const deductions = Math.round(base * 0.24);
  return {
    id: `pay-${e.id}`,
    employeeId: e.id,
    period: "August 2026",
    base,
    bonus,
    deductions,
    net: base + bonus - deductions,
    status: e.status === "offboarding" ? "on-hold" : i % 5 === 0 ? "processing" : "paid",
  };
});

export const payrollTrend = [
  { month: "Mar", cost: 84200 },
  { month: "Apr", cost: 86100 },
  { month: "May", cost: 88400 },
  { month: "Jun", cost: 90250 },
  { month: "Jul", cost: 91800 },
  { month: "Aug", cost: 94600 },
];

export type PerformanceReview = {
  id: string;
  employeeId: string;
  cycle: string;
  score: number;
  goalsMet: number;
  goalsTotal: number;
  reviewer: string;
  status: "completed" | "in-review" | "scheduled";
};

export const performance: PerformanceReview[] = [
  {
    id: "pf-1",
    employeeId: "emp-1001",
    cycle: "H1 2026",
    score: 4.7,
    goalsMet: 7,
    goalsTotal: 8,
    reviewer: "Daniel Reyes",
    status: "completed",
  },
  {
    id: "pf-2",
    employeeId: "emp-1002",
    cycle: "H1 2026",
    score: 4.4,
    goalsMet: 6,
    goalsTotal: 7,
    reviewer: "Priya Nair",
    status: "completed",
  },
  {
    id: "pf-3",
    employeeId: "emp-1004",
    cycle: "H1 2026",
    score: 4.1,
    goalsMet: 5,
    goalsTotal: 7,
    reviewer: "Nadia Haddad",
    status: "in-review",
  },
  {
    id: "pf-4",
    employeeId: "emp-1006",
    cycle: "H1 2026",
    score: 3.6,
    goalsMet: 3,
    goalsTotal: 6,
    reviewer: "Amara Okafor",
    status: "in-review",
  },
  {
    id: "pf-5",
    employeeId: "emp-1007",
    cycle: "H1 2026",
    score: 4.5,
    goalsMet: 6,
    goalsTotal: 6,
    reviewer: "Daniel Reyes",
    status: "completed",
  },
  {
    id: "pf-6",
    employeeId: "emp-1009",
    cycle: "H1 2026",
    score: 0,
    goalsMet: 0,
    goalsTotal: 5,
    reviewer: "Sofia Marchetti",
    status: "scheduled",
  },
];

export const performanceByDept = [
  { department: "Creative", score: 4.3 },
  { department: "Media", score: 4.5 },
  { department: "Strategy", score: 4.0 },
  { department: "Engineering", score: 4.2 },
  { department: "Operations", score: 4.4 },
  { department: "Sales", score: 3.9 },
];

export type EmployeeDocument = {
  id: string;
  employeeId: string;
  name: string;
  category: "Contract" | "ID" | "Policy" | "Certificate" | "Payslip";
  size: string;
  uploadedOn: string;
  expiresOn?: string;
  status: "valid" | "expiring" | "expired";
};

export const documents: EmployeeDocument[] = [
  {
    id: "doc-1",
    employeeId: "emp-1001",
    name: "Employment Contract.pdf",
    category: "Contract",
    size: "412 KB",
    uploadedOn: "2021-03-15",
    status: "valid",
  },
  {
    id: "doc-2",
    employeeId: "emp-1002",
    name: "Google Ads Certification.pdf",
    category: "Certificate",
    size: "128 KB",
    uploadedOn: "2025-07-02",
    expiresOn: "2026-09-30",
    status: "expiring",
  },
  {
    id: "doc-3",
    employeeId: "emp-1004",
    name: "Right to Work.pdf",
    category: "ID",
    size: "96 KB",
    uploadedOn: "2023-05-20",
    status: "valid",
  },
  {
    id: "doc-4",
    employeeId: "emp-1006",
    name: "Contractor Agreement.pdf",
    category: "Contract",
    size: "301 KB",
    uploadedOn: "2026-06-01",
    expiresOn: "2026-12-01",
    status: "valid",
  },
  {
    id: "doc-5",
    employeeId: "emp-1010",
    name: "Passport Copy.pdf",
    category: "ID",
    size: "204 KB",
    uploadedOn: "2020-02-17",
    expiresOn: "2026-05-01",
    status: "expired",
  },
  {
    id: "doc-6",
    employeeId: "emp-1007",
    name: "Remote Work Policy.pdf",
    category: "Policy",
    size: "88 KB",
    uploadedOn: "2026-01-11",
    status: "valid",
  },
  {
    id: "doc-7",
    employeeId: "emp-1005",
    name: "July Payslip.pdf",
    category: "Payslip",
    size: "64 KB",
    uploadedOn: "2026-08-01",
    status: "valid",
  },
];

export type TimesheetEntry = {
  id: string;
  employeeId: string;
  client: string;
  project: string;
  task: string;
  date: string;
  hours: number;
  billable: boolean;
  status: "draft" | "submitted" | "approved";
};

export const timesheets: TimesheetEntry[] = [
  {
    id: "ts-1",
    employeeId: "emp-1001",
    client: "Northwind Coffee",
    project: "Brand Refresh",
    task: "Art direction review",
    date: "2026-08-27",
    hours: 3.5,
    billable: true,
    status: "approved",
  },
  {
    id: "ts-2",
    employeeId: "emp-1002",
    client: "Volta Motors",
    project: "Q3 Paid Media",
    task: "Campaign optimization",
    date: "2026-08-27",
    hours: 6,
    billable: true,
    status: "submitted",
  },
  {
    id: "ts-3",
    employeeId: "emp-1004",
    client: "Helio Health",
    project: "Website Rebuild",
    task: "Component library",
    date: "2026-08-27",
    hours: 7.5,
    billable: true,
    status: "approved",
  },
  {
    id: "ts-4",
    employeeId: "emp-1007",
    client: "Internal",
    project: "Agency Ops",
    task: "Resourcing plan",
    date: "2026-08-27",
    hours: 2,
    billable: false,
    status: "draft",
  },
  {
    id: "ts-5",
    employeeId: "emp-1009",
    client: "Northwind Coffee",
    project: "Content Engine",
    task: "Editorial calendar",
    date: "2026-08-26",
    hours: 4,
    billable: true,
    status: "submitted",
  },
  {
    id: "ts-6",
    employeeId: "emp-1006",
    client: "Volta Motors",
    project: "Launch Film",
    task: "Animation pass 2",
    date: "2026-08-26",
    hours: 8,
    billable: true,
    status: "approved",
  },
  {
    id: "ts-7",
    employeeId: "emp-1008",
    client: "Prospect",
    project: "New Business",
    task: "Pitch deck",
    date: "2026-08-26",
    hours: 3,
    billable: false,
    status: "draft",
  },
];

export const revenueTrend = [
  { month: "Mar", revenue: 218000, costs: 154000 },
  { month: "Apr", revenue: 232000, costs: 161000 },
  { month: "May", revenue: 227000, costs: 158500 },
  { month: "Jun", revenue: 254000, costs: 168000 },
  { month: "Jul", revenue: 271000, costs: 172400 },
  { month: "Aug", revenue: 289500, costs: 178900 },
];

export const pipeline = [
  { stage: "Discovery", value: 180000 },
  { stage: "Proposal", value: 265000 },
  { stage: "Negotiation", value: 142000 },
  { stage: "Won", value: 98000 },
];

export const clients = [
  {
    id: "cl-1",
    name: "Northwind Coffee",
    industry: "Retail",
    owner: "Sofia Marchetti",
    mrr: 24000,
    health: "healthy",
    projects: 3,
  },
  {
    id: "cl-2",
    name: "Volta Motors",
    industry: "Automotive",
    owner: "Priya Nair",
    mrr: 58000,
    health: "healthy",
    projects: 5,
  },
  {
    id: "cl-3",
    name: "Helio Health",
    industry: "Healthcare",
    owner: "Marcus Doyle",
    mrr: 31000,
    health: "at-risk",
    projects: 2,
  },
  {
    id: "cl-4",
    name: "Lumen Finance",
    industry: "Fintech",
    owner: "Sofia Marchetti",
    mrr: 19500,
    health: "healthy",
    projects: 1,
  },
  {
    id: "cl-5",
    name: "Terra Outdoor",
    industry: "Apparel",
    owner: "Marcus Doyle",
    mrr: 12500,
    health: "churn-risk",
    projects: 1,
  },
];

export const projects = [
  {
    id: "pr-1",
    name: "Brand Refresh",
    client: "Northwind Coffee",
    lead: "Amara Okafor",
    progress: 72,
    budget: 86000,
    status: "on-track",
    due: "2026-09-30",
  },
  {
    id: "pr-2",
    name: "Q3 Paid Media",
    client: "Volta Motors",
    lead: "Kenji Tanaka",
    progress: 54,
    budget: 210000,
    status: "on-track",
    due: "2026-10-15",
  },
  {
    id: "pr-3",
    name: "Website Rebuild",
    client: "Helio Health",
    lead: "Liam Bennett",
    progress: 38,
    budget: 124000,
    status: "at-risk",
    due: "2026-11-04",
  },
  {
    id: "pr-4",
    name: "Launch Film",
    client: "Volta Motors",
    lead: "Noah Feldman",
    progress: 88,
    budget: 64000,
    status: "on-track",
    due: "2026-09-08",
  },
  {
    id: "pr-5",
    name: "Content Engine",
    client: "Northwind Coffee",
    lead: "Fatima Zahra",
    progress: 21,
    budget: 38000,
    status: "delayed",
    due: "2026-12-01",
  },
];

export const tasks = [
  {
    id: "tk-1",
    title: "Approve key visual round 3",
    project: "Brand Refresh",
    assignee: "Amara Okafor",
    due: "2026-08-29",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "tk-2",
    title: "Rebalance Q3 media budget",
    project: "Q3 Paid Media",
    assignee: "Kenji Tanaka",
    due: "2026-08-30",
    priority: "high",
    status: "todo",
  },
  {
    id: "tk-3",
    title: "Ship design tokens package",
    project: "Website Rebuild",
    assignee: "Liam Bennett",
    due: "2026-09-02",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "tk-4",
    title: "Final color grade",
    project: "Launch Film",
    assignee: "Noah Feldman",
    due: "2026-09-01",
    priority: "medium",
    status: "review",
  },
  {
    id: "tk-5",
    title: "Q4 editorial outline",
    project: "Content Engine",
    assignee: "Fatima Zahra",
    due: "2026-09-05",
    priority: "low",
    status: "todo",
  },
  {
    id: "tk-6",
    title: "Renewal deck for Helio",
    project: "Website Rebuild",
    assignee: "Marcus Doyle",
    due: "2026-08-31",
    priority: "high",
    status: "todo",
  },
];

export const leads = [
  {
    id: "ld-1",
    company: "Aurora Skincare",
    contact: "Elena Vos",
    stage: "Proposal",
    value: 92000,
    owner: "Marcus Doyle",
    source: "Referral",
  },
  {
    id: "ld-2",
    company: "Bright Ledger",
    contact: "Tom Ibrahim",
    stage: "Discovery",
    value: 48000,
    owner: "Marcus Doyle",
    source: "Inbound",
  },
  {
    id: "ld-3",
    company: "Kite Travel",
    contact: "Ana Duarte",
    stage: "Negotiation",
    value: 142000,
    owner: "Priya Nair",
    source: "Outbound",
  },
  {
    id: "ld-4",
    company: "Grove Foods",
    contact: "Sam Whitaker",
    stage: "Discovery",
    value: 65000,
    owner: "Marcus Doyle",
    source: "Event",
  },
];

export const assets = [
  {
    id: "as-1",
    name: 'MacBook Pro 16"',
    tag: "AGN-LT-0142",
    assignedTo: "Liam Bennett",
    category: "Laptop",
    status: "assigned",
  },
  {
    id: "as-2",
    name: "Sony FX3 Camera",
    tag: "AGN-CAM-0021",
    assignedTo: "Noah Feldman",
    category: "Camera",
    status: "assigned",
  },
  {
    id: "as-3",
    name: "Adobe CC Seat",
    tag: "AGN-SW-0310",
    assignedTo: "Amara Okafor",
    category: "Software",
    status: "assigned",
  },
  {
    id: "as-4",
    name: 'Dell UltraSharp 27"',
    tag: "AGN-MON-0088",
    assignedTo: "Unassigned",
    category: "Monitor",
    status: "available",
  },
  {
    id: "as-5",
    name: "iPhone 15",
    tag: "AGN-PH-0055",
    assignedTo: "Diego Alvarez",
    category: "Phone",
    status: "returning",
  },
];

export const inbox = [
  {
    id: "in-1",
    from: "Elena Vos — Aurora Skincare",
    subject: "Re: Proposal feedback",
    preview: "The team loved the strategy section. Two questions on scope…",
    time: "12m",
    unread: true,
  },
  {
    id: "in-2",
    from: "Priya Nair",
    subject: "Volta budget approval",
    preview: "Need your sign-off before Monday's flight goes live.",
    time: "1h",
    unread: true,
  },
  {
    id: "in-3",
    from: "Helio Health",
    subject: "Sprint review notes",
    preview: "Attaching notes from today's review with the clinical team.",
    time: "4h",
    unread: false,
  },
  {
    id: "in-4",
    from: "Ivy Chen",
    subject: "September resourcing draft",
    preview: "Creative is over-allocated by 18 hours next month.",
    time: "1d",
    unread: false,
  },
];

export const activityFeed = [
  {
    id: "ac-1",
    who: "Kenji Tanaka",
    what: "submitted a timesheet for Volta Motors",
    when: "18 minutes ago",
  },
  { id: "ac-2", who: "Ivy Chen", what: "approved 2 leave requests", when: "1 hour ago" },
  {
    id: "ac-3",
    who: "Marcus Doyle",
    what: "moved Kite Travel to Negotiation",
    when: "3 hours ago",
  },
  {
    id: "ac-4",
    who: "Amara Okafor",
    what: "uploaded Brand Refresh key visuals",
    when: "Yesterday",
  },
  { id: "ac-5", who: "Payroll", what: "August run marked ready for review", when: "Yesterday" },
];

export const employeeById = (id: string) => employees.find((e) => e.id === id);
export const employeeName = (id: string) => employeeById(id)?.name ?? "Unknown";
export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
