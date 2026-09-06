-- Finance module — matches src/data/finance.ts's Invoice/InvoiceLineItem/
-- Expense shapes. "Payments" (finance.payments.tsx) isn't a separate table:
-- it's derived in the UI by filtering invoices for status = 'paid', same as
-- the live app does today.
--
-- Deliberately out of scope for this migration: nothing else in this
-- module has its own persisted entity — the Reports > Finance aggregates
-- are computed client-side from these two tables.

create type invoice_status as enum ('paid', 'sent', 'overdue', 'draft');

create table invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  client_id uuid not null references clients(id) on delete cascade,
  issue_date date not null default current_date,
  due_date date not null,
  status invoice_status not null default 'draft',
  tax_rate numeric not null default 0,
  notes text not null default '',
  paid_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null default '',
  quantity numeric not null default 1,
  rate numeric not null default 0
);

create type expense_status as enum ('approved', 'pending', 'rejected');
create type expense_category as enum (
  'Software', 'Contractors', 'Travel', 'Media Spend', 'Office', 'Production', 'Professional Services'
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  vendor text not null,
  category expense_category not null default 'Software',
  date date not null default current_date,
  amount numeric not null default 0,
  status expense_status not null default 'pending',
  submitted_by text not null default '',
  client_id uuid references clients(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table expenses enable row level security;

create policy "invoices viewable" on invoices for select using (private.has_permission('Finance', 'view'));
create policy "invoices insertable" on invoices for insert with check (private.has_permission('Finance', 'edit'));
create policy "invoices updatable" on invoices for update using (private.has_permission('Finance', 'edit'));
create policy "invoices deletable" on invoices for delete using (private.has_permission('Finance', 'delete'));

create policy "invoice_line_items viewable" on invoice_line_items for select using (private.has_permission('Finance', 'view'));
create policy "invoice_line_items insertable" on invoice_line_items for insert with check (private.has_permission('Finance', 'edit'));
create policy "invoice_line_items updatable" on invoice_line_items for update using (private.has_permission('Finance', 'edit'));
create policy "invoice_line_items deletable" on invoice_line_items for delete using (private.has_permission('Finance', 'delete'));

create policy "expenses viewable" on expenses for select using (private.has_permission('Finance', 'view'));
create policy "expenses insertable" on expenses for insert with check (private.has_permission('Finance', 'edit'));
create policy "expenses updatable" on expenses for update using (private.has_permission('Finance', 'edit'));
create policy "expenses deletable" on expenses for delete using (private.has_permission('Finance', 'delete'));

create trigger invoices_set_updated_at
  before update on invoices
  for each row execute function set_updated_at();
