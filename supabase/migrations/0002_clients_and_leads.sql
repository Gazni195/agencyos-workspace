-- Clients & Leads module — first real module, matches the shape of
-- src/data/crm.ts's Client/ClientContact/Retainer/ClientActivityEvent/
-- ClientDocument/Lead/LeadNote types so the frontend's existing screens
-- don't need to change their data shape, only where the data comes from.

create type client_health as enum ('healthy', 'at-risk', 'churn-risk');
create type package_type as enum ('monthly', 'one-time');

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default '',
  owner text not null default '',
  mrr numeric not null default 0,
  health client_health not null default 'healthy',
  logo text not null default '',
  since date not null default current_date,
  address text not null default '',
  website text not null default '',
  notes text not null default '',
  package_type package_type not null default 'monthly',
  package_name text not null default '',
  package_price numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  role text not null default '',
  email text not null default '',
  phone text not null default '',
  is_primary boolean not null default false
);

create type retainer_status as enum ('active', 'renewal-due', 'at-risk');

create table retainers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  monthly_value numeric not null default 0,
  scope text not null default '',
  start_date date not null,
  renewal_date date not null,
  status retainer_status not null default 'active'
);

create type client_activity_type as enum ('note', 'meeting', 'email', 'milestone', 'invoice');

create table client_activity (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type client_activity_type not null,
  title text not null,
  description text not null default '',
  who text not null,
  happened_on date not null default current_date
);

create type client_document_category as enum ('Contract', 'Brief', 'Report', 'Creative', 'Invoice');

create table client_documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  category client_document_category not null,
  size text not null default '',
  uploaded_on date not null default current_date
);

create type lead_stage as enum (
  'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact text not null default '',
  email text not null default '',
  phone text not null default '',
  stage lead_stage not null default 'New',
  value numeric not null default 0,
  owner text not null default '',
  source text not null default '',
  next_action text not null default '',
  created_on date not null default current_date,
  -- set when a lead converts to a client, so the "View client ->" link on
  -- the lead detail page (src/routes/leads.$leadId.tsx) works against real
  -- data instead of app-local state.
  converted_client_id uuid references clients(id) on delete set null,
  created_at timestamptz not null default now()
);

create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author text not null,
  written_on date not null default current_date,
  text text not null
);

alter table clients enable row level security;
alter table client_contacts enable row level security;
alter table retainers enable row level security;
alter table client_activity enable row level security;
alter table client_documents enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;

-- Every table in this module follows the same three-rule shape: view gates
-- reads, edit gates inserts/updates, delete gates deletes — mirroring the
-- app's existing per-module PermissionMatrix exactly.
create policy "clients viewable" on clients for select using (has_permission('Clients', 'view'));
create policy "clients insertable" on clients for insert with check (has_permission('Clients', 'edit'));
create policy "clients updatable" on clients for update using (has_permission('Clients', 'edit'));
create policy "clients deletable" on clients for delete using (has_permission('Clients', 'delete'));

create policy "client_contacts viewable" on client_contacts for select using (has_permission('Clients', 'view'));
create policy "client_contacts insertable" on client_contacts for insert with check (has_permission('Clients', 'edit'));
create policy "client_contacts updatable" on client_contacts for update using (has_permission('Clients', 'edit'));
create policy "client_contacts deletable" on client_contacts for delete using (has_permission('Clients', 'delete'));

create policy "retainers viewable" on retainers for select using (has_permission('Clients', 'view'));
create policy "retainers insertable" on retainers for insert with check (has_permission('Clients', 'edit'));
create policy "retainers updatable" on retainers for update using (has_permission('Clients', 'edit'));
create policy "retainers deletable" on retainers for delete using (has_permission('Clients', 'delete'));

create policy "client_activity viewable" on client_activity for select using (has_permission('Clients', 'view'));
create policy "client_activity insertable" on client_activity for insert with check (has_permission('Clients', 'edit'));
create policy "client_activity updatable" on client_activity for update using (has_permission('Clients', 'edit'));
create policy "client_activity deletable" on client_activity for delete using (has_permission('Clients', 'delete'));

create policy "client_documents viewable" on client_documents for select using (has_permission('Clients', 'view'));
create policy "client_documents insertable" on client_documents for insert with check (has_permission('Clients', 'edit'));
create policy "client_documents updatable" on client_documents for update using (has_permission('Clients', 'edit'));
create policy "client_documents deletable" on client_documents for delete using (has_permission('Clients', 'delete'));

create policy "leads viewable" on leads for select using (has_permission('Leads', 'view'));
create policy "leads insertable" on leads for insert with check (has_permission('Leads', 'edit'));
create policy "leads updatable" on leads for update using (has_permission('Leads', 'edit'));
create policy "leads deletable" on leads for delete using (has_permission('Leads', 'delete'));

create policy "lead_notes viewable" on lead_notes for select using (has_permission('Leads', 'view'));
create policy "lead_notes insertable" on lead_notes for insert with check (has_permission('Leads', 'edit'));
create policy "lead_notes updatable" on lead_notes for update using (has_permission('Leads', 'edit'));
create policy "lead_notes deletable" on lead_notes for delete using (has_permission('Leads', 'delete'));

-- Keep updated_at honest on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();
