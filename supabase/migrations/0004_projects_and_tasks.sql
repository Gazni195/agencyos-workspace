-- Projects & Tasks module — matches src/data/delivery.ts's DeliveryProject/
-- DeliveryTask/ChecklistItem/TaskComment shapes. Employee references
-- (project.lead, project.team, task.assignee_id) stay plain text/uuid-as-text
-- rather than real foreign keys: the Employees/HR module isn't in Supabase
-- yet (src/store/employeesStore.ts is still in-memory), same reasoning as
-- clients.owner in migration 0002.
--
-- Deliberately out of scope for this migration (still in-memory only, same
-- disclosure as clients/leads' nested entities): milestones, project
-- allocations, budget burn points, project activity feed, project files,
-- and deliverables.

create type project_status as enum ('on-track', 'at-risk', 'delayed', 'completed');
create type project_health as enum ('green', 'yellow', 'red');

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid not null references clients(id) on delete cascade,
  lead text not null default '',
  lead_initials text not null default '',
  team text[] not null default '{}',
  progress integer not null default 0,
  budget numeric not null default 0,
  spend numeric not null default 0,
  status project_status not null default 'on-track',
  start_date date not null default current_date,
  due date not null,
  description text not null default '',
  health project_health not null default 'green',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type task_status as enum ('todo', 'in-progress', 'review', 'blocked', 'done');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  project_id uuid not null references projects(id) on delete cascade,
  assignee_id text not null default '',
  due date,
  priority task_priority not null default 'medium',
  status task_status not null default 'todo',
  tags text[] not null default '{}',
  dependencies text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table task_checklist_items (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  label text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  author text not null,
  text text not null,
  written_on date not null default current_date
);

alter table projects enable row level security;
alter table tasks enable row level security;
alter table task_checklist_items enable row level security;
alter table task_comments enable row level security;

create policy "projects viewable" on projects for select using (has_permission('Projects', 'view'));
create policy "projects insertable" on projects for insert with check (has_permission('Projects', 'edit'));
create policy "projects updatable" on projects for update using (has_permission('Projects', 'edit'));
create policy "projects deletable" on projects for delete using (has_permission('Projects', 'delete'));

create policy "tasks viewable" on tasks for select using (has_permission('Tasks', 'view'));
create policy "tasks insertable" on tasks for insert with check (has_permission('Tasks', 'edit'));
create policy "tasks updatable" on tasks for update using (has_permission('Tasks', 'edit'));
create policy "tasks deletable" on tasks for delete using (has_permission('Tasks', 'delete'));

create policy "task_checklist_items viewable" on task_checklist_items for select using (has_permission('Tasks', 'view'));
create policy "task_checklist_items insertable" on task_checklist_items for insert with check (has_permission('Tasks', 'edit'));
create policy "task_checklist_items updatable" on task_checklist_items for update using (has_permission('Tasks', 'edit'));
create policy "task_checklist_items deletable" on task_checklist_items for delete using (has_permission('Tasks', 'delete'));

create policy "task_comments viewable" on task_comments for select using (has_permission('Tasks', 'view'));
create policy "task_comments insertable" on task_comments for insert with check (has_permission('Tasks', 'edit'));
create policy "task_comments updatable" on task_comments for update using (has_permission('Tasks', 'edit'));
create policy "task_comments deletable" on task_comments for delete using (has_permission('Tasks', 'delete'));

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

create trigger tasks_set_updated_at
  before update on tasks
  for each row execute function set_updated_at();
