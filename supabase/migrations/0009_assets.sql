-- Assets module — matches src/data/workspace.ts's AssetFile shape. This is
-- metadata only (no real file bytes are stored anywhere in this app —
-- there's no Storage bucket wiring, upload UI just records a name/type/tags
-- like the other document-metadata tables in this project). `versions` has
-- no independent add/edit action anywhere in the UI (only ever set once, at
-- upload time), so it's a jsonb column here rather than a normalized table.
--
-- Folders (asset_folders) stay a fixed, hardcoded taxonomy in
-- src/data/workspace.ts — there's no create/rename/delete UI for them, so
-- there's nothing to persist.

create table asset_files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'doc',
  size text not null default '',
  owner_id text not null default '',
  owner_name text not null default '',
  owner_initials text not null default '',
  tags text[] not null default '{}',
  shared boolean not null default false,
  expiring boolean not null default false,
  folder_id text not null default 'root',
  versions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table asset_files enable row level security;

create policy "asset_files viewable" on asset_files for select using (private.has_permission('Assets', 'view'));
create policy "asset_files insertable" on asset_files for insert with check (private.has_permission('Assets', 'edit'));
create policy "asset_files updatable" on asset_files for update using (private.has_permission('Assets', 'edit'));
create policy "asset_files deletable" on asset_files for delete using (private.has_permission('Assets', 'delete'));

create trigger asset_files_set_updated_at
  before update on asset_files
  for each row execute function set_updated_at();
