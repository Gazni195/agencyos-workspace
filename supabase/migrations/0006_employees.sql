-- Employees module — core HR roster, matches src/data/agency.ts's Employee
-- type. This is the master directory every other module already points at
-- by id/name (project.lead/team, task.assignee_id, client.owner) — wiring
-- it to Supabase is what lets those references eventually resolve to real
-- rows instead of names typed into a text field.
--
-- role_id is a real foreign key into `roles` (unlike department, which
-- stays plain text: Settings' department/designation catalog is still
-- in-memory only, same reasoning as clients.owner in migration 0002).
--
-- Deliberately out of scope for this migration (same disclosure pattern as
-- every module so far — still in-memory only): attendance, leave requests,
-- payroll runs, performance reviews, employee documents, timesheets, and
-- goals. Those are the Employees module's other six tabs.
--
-- Note: an "employee" here is an HR roster record, not necessarily a login.
-- It's intentionally separate from `profiles` (people who can sign in) —
-- an agency can list a contractor or a not-yet-onboarded hire as an
-- employee for allocation purposes without them ever having an account.

create type employee_status as enum ('active', 'on-leave', 'probation', 'offboarding');
create type employment_type as enum ('Full-time', 'Part-time', 'Contract');

create table employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  initials text not null default '',
  role text not null default '',
  department text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  employment_type employment_type not null default 'Full-time',
  status employee_status not null default 'probation',
  manager text not null default '',
  joined_on date not null default current_date,
  salary numeric not null default 0,
  utilization integer not null default 0,
  leave_balance numeric not null default 0,
  skills text[] not null default '{}',
  role_id text not null references roles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table employees enable row level security;

create policy "employees viewable" on employees for select using (private.has_permission('Employees', 'view'));
create policy "employees insertable" on employees for insert with check (private.has_permission('Employees', 'edit'));
create policy "employees updatable" on employees for update using (private.has_permission('Employees', 'edit'));
create policy "employees deletable" on employees for delete using (private.has_permission('Employees', 'delete'));

create trigger employees_set_updated_at
  before update on employees
  for each row execute function set_updated_at();
