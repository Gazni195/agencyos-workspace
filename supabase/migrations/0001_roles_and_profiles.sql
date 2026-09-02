-- Foundation: who can log in, and what they're allowed to do.
-- Mirrors the app's existing Settings -> Roles & Permissions screen
-- (src/data/workspace.ts: rolesSeed, permissionModules, PermissionMatrix)
-- so that screen becomes a real editor over these tables instead of an
-- in-memory mock.

create table roles (
  id text primary key,
  name text not null,
  description text not null default ''
);

-- Fixed vocabulary of modules, matching the app's routes 1:1 (see
-- src/data/workspace.ts's permissionModules comment for why this has to
-- stay in sync with the sidebar rather than just being a plausible list).
create type permission_module as enum (
  'Clients', 'Leads', 'Projects', 'Tasks', 'Operations',
  'Employees', 'Finance', 'Reports', 'Inbox', 'Assets', 'Settings'
);

create table role_permissions (
  role_id text not null references roles(id) on delete cascade,
  module permission_module not null,
  can_view boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  primary key (role_id, module)
);

-- One row per person who can sign in. id matches the corresponding
-- auth.users row (Supabase's built-in login table) 1:1. This is the seed
-- of what becomes the full Employee record once the Employees/HR module is
-- built — kept minimal here since only identity + role are needed for
-- login and permission checks to work.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role_id text not null references roles(id),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up, so the app never has
-- an authenticated user with no profile/role. New signups default to the
-- lowest-privilege role; an admin promotes them from Settings afterward.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'role-employee'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper functions used by every table's Row Level Security policies below
-- (and in every future module's migration) so access rules stay in one
-- place instead of being copy-pasted per table.
create or replace function current_role_id()
returns text as $$
  select role_id from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function has_permission(target_module permission_module, action text)
returns boolean as $$
  select case action
    when 'view' then coalesce((select can_view from role_permissions where role_id = current_role_id() and module = target_module), false)
    when 'edit' then coalesce((select can_edit from role_permissions where role_id = current_role_id() and module = target_module), false)
    when 'delete' then coalesce((select can_delete from role_permissions where role_id = current_role_id() and module = target_module), false)
    else false
  end;
$$ language sql stable security definer;

alter table roles enable row level security;
alter table role_permissions enable row level security;
alter table profiles enable row level security;

-- Any signed-in user can read the role catalog and their own permissions
-- (needed to render the sidebar/gating), but only someone with edit access
-- to Settings can change them.
create policy "roles readable by signed-in users" on roles
  for select using (auth.uid() is not null);
create policy "roles editable by settings admins" on roles
  for all using (has_permission('Settings', 'edit'));

create policy "permissions readable by signed-in users" on role_permissions
  for select using (auth.uid() is not null);
create policy "permissions editable by settings admins" on role_permissions
  for all using (has_permission('Settings', 'edit'));

create policy "profiles readable by signed-in users" on profiles
  for select using (auth.uid() is not null);
create policy "own profile updatable" on profiles
  for update using (auth.uid() = id);
create policy "profiles manageable by settings admins" on profiles
  for all using (has_permission('Settings', 'edit'));

-- Seed the same five roles the app already ships with, so Settings ->
-- Roles & Permissions has something to render on day one.
insert into roles (id, name, description) values
  ('role-admin', 'Admin', 'Full access to all modules and settings.'),
  ('role-manager', 'Manager', 'Manage teams, approve requests, view reports.'),
  ('role-employee', 'Employee', 'Standard access to assigned work.'),
  ('role-finance', 'Finance', 'Access to billing, payroll and invoicing.'),
  ('role-client', 'Client (Portal)', 'Limited external view of shared projects.');

-- Same default permission grid as defaultPermissionMatrix() in
-- src/data/workspace.ts.
insert into role_permissions (role_id, module, can_view, can_edit, can_delete) values
  ('role-admin', 'Clients', true, true, true),
  ('role-admin', 'Leads', true, true, true),
  ('role-admin', 'Projects', true, true, true),
  ('role-admin', 'Tasks', true, true, true),
  ('role-admin', 'Operations', true, true, true),
  ('role-admin', 'Employees', true, true, true),
  ('role-admin', 'Finance', true, true, true),
  ('role-admin', 'Reports', true, true, true),
  ('role-admin', 'Inbox', true, true, true),
  ('role-admin', 'Assets', true, true, true),
  ('role-admin', 'Settings', true, true, true),

  ('role-manager', 'Clients', true, true, false),
  ('role-manager', 'Leads', true, true, false),
  ('role-manager', 'Projects', true, true, false),
  ('role-manager', 'Tasks', true, true, false),
  ('role-manager', 'Operations', true, true, false),
  ('role-manager', 'Employees', true, true, false),
  ('role-manager', 'Finance', true, true, false),
  ('role-manager', 'Reports', true, true, false),
  ('role-manager', 'Inbox', true, true, false),
  ('role-manager', 'Assets', true, true, false),
  ('role-manager', 'Settings', true, false, false),

  ('role-employee', 'Clients', true, false, false),
  ('role-employee', 'Leads', true, false, false),
  ('role-employee', 'Projects', true, false, false),
  ('role-employee', 'Tasks', true, true, false),
  ('role-employee', 'Operations', true, false, false),
  ('role-employee', 'Inbox', true, false, false),
  ('role-employee', 'Assets', true, false, false),

  ('role-finance', 'Clients', true, false, false),
  ('role-finance', 'Projects', true, false, false),
  ('role-finance', 'Finance', true, true, false),
  ('role-finance', 'Reports', true, false, false),

  ('role-client', 'Projects', true, false, false);
