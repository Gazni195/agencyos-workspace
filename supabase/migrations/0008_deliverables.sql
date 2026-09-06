-- Deliverables — the client-facing outputs a project produces (a video, a
-- design file, a report), distinct from internal Tasks. Backs both the
-- Project detail "Deliverables" tab and the standalone Operations
-- approval queue (operations.deliverables.tsx) — one source of truth.
-- Gated under the 'Projects' permission, same as this entity's required
-- foreign key (there's no separate 'Deliverables' or 'Operations' module
-- permission — Operations' own routes are gated by 'Operations' for
-- viewing the page, but the underlying record belongs to a project).

create type deliverable_status as enum (
  'in-progress', 'internal-review', 'client-review', 'changes-requested', 'approved'
);

create table deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  title text not null,
  type text not null default '',
  assignee_id text not null default '',
  status deliverable_status not null default 'in-progress',
  due_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table deliverables enable row level security;

create policy "deliverables viewable" on deliverables for select using (private.has_permission('Projects', 'view'));
create policy "deliverables insertable" on deliverables for insert with check (private.has_permission('Projects', 'edit'));
create policy "deliverables updatable" on deliverables for update using (private.has_permission('Projects', 'edit'));
create policy "deliverables deletable" on deliverables for delete using (private.has_permission('Projects', 'delete'));
