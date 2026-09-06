-- Settings' admin-managed catalogs — Departments, Designations, Client
-- Packages and Leave Types — matching src/data/workspace.ts's shapes.
-- Every consuming form (Employee create/edit, Client create/edit, Leave
-- filters) reads its options from these tables now instead of an
-- in-memory seed. designations.department stores the department *name*
-- (not an id FK), matching how the existing UI already keys its Select by
-- department.name. client_packages.type reuses package_type from
-- migration 0002 (clients.package_type) since it's the same vocabulary.
--
-- Deliberately out of scope for this migration: Attendance Policies,
-- Integrations, Workflow approvers and Notification preferences. None of
-- those back real behavior even conceptually — there's no attendance
-- clock-in flow to police, no actual third-party integration behind
-- "Connected: true/false", and workflow/notification prefs are simple
-- config toggles with no consuming logic anywhere in the app yet. Wiring
-- them to a table would just move the same emptiness into Postgres.

create table departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  head text not null default 'Unassigned',
  created_at timestamptz not null default now()
);

create table designations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null default '',
  level text not null default '',
  created_at timestamptz not null default now()
);

create table client_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type package_type not null default 'monthly',
  default_price numeric not null default 0,
  created_at timestamptz not null default now()
);

create table leave_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  annual_allowance numeric not null default 0,
  carry_over boolean not null default false,
  color text not null default 'chart-1',
  created_at timestamptz not null default now()
);

alter table departments enable row level security;
alter table designations enable row level security;
alter table client_packages enable row level security;
alter table leave_types enable row level security;

create policy "departments viewable" on departments for select using (auth.uid() is not null);
create policy "departments editable" on departments for insert with check (private.has_permission('Settings', 'edit'));
create policy "departments updatable" on departments for update using (private.has_permission('Settings', 'edit'));
create policy "departments deletable" on departments for delete using (private.has_permission('Settings', 'delete'));

create policy "designations viewable" on designations for select using (auth.uid() is not null);
create policy "designations editable" on designations for insert with check (private.has_permission('Settings', 'edit'));
create policy "designations updatable" on designations for update using (private.has_permission('Settings', 'edit'));
create policy "designations deletable" on designations for delete using (private.has_permission('Settings', 'delete'));

create policy "client_packages viewable" on client_packages for select using (auth.uid() is not null);
create policy "client_packages editable" on client_packages for insert with check (private.has_permission('Settings', 'edit'));
create policy "client_packages updatable" on client_packages for update using (private.has_permission('Settings', 'edit'));
create policy "client_packages deletable" on client_packages for delete using (private.has_permission('Settings', 'delete'));

create policy "leave_types viewable" on leave_types for select using (auth.uid() is not null);
create policy "leave_types editable" on leave_types for insert with check (private.has_permission('Settings', 'edit'));
create policy "leave_types updatable" on leave_types for update using (private.has_permission('Settings', 'edit'));
create policy "leave_types deletable" on leave_types for delete using (private.has_permission('Settings', 'delete'));
