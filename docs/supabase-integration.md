# Supabase Integration (interim backend)

AgencyOS is being connected to Supabase as its real backend while a
custom-hosted backend is designed and built separately (see the
architecture discussion in this project's history). When the custom
backend is ready, only the data-access layer needs to be repointed — the
database schema and screens don't have to change shape, since this schema
mirrors the app's existing TypeScript types exactly.

## What's in place

- `src/lib/supabaseClient.ts` — browser client (anon key). Every module's
  store will read/write through this instead of its old in-memory seed
  array.
- `src/lib/supabaseAdmin.ts` — server-only client (service_role key), for
  privileged operations that Row Level Security can't express cleanly.
  Never imported from anything that reaches the browser.
- `supabase/migrations/0001_roles_and_profiles.sql` — the login/permission
  foundation: `roles`, `role_permissions`, `profiles` (one row per person
  who can sign in, linked to Supabase's built-in `auth.users`), and the
  `has_permission(module, action)` helper every other table's access rules
  call. Seeded with the same five roles and default permission grid the
  app already ships with in `src/data/workspace.ts`.
- `supabase/migrations/0002_clients_and_leads.sql` — the first real module:
  `clients`, `client_contacts`, `retainers`, `client_activity`,
  `client_documents`, `leads`, `lead_notes`. Each table's Row Level
  Security policies gate view/edit/delete against `has_permission(...)`,
  so Settings -> Roles & Permissions will control real database access,
  not just which buttons render.

## What's still needed

1. **Your project's credentials**, from the Supabase dashboard ->
   Settings -> API: Project URL, anon/public key, service_role key. These
   go in a local `.env` file (see `.env.example`) — never committed.
2. **Running the migrations** against your actual project. Either:
   - Paste each file's contents into the Supabase dashboard's SQL Editor
     and run them in order (0001, then 0002) — no tooling needed, or
   - Share the project's direct Postgres connection string (Settings ->
     Database -> Connection string) and this can be done automatically.
3. Once the schema exists for real, `src/lib/supabaseTypes.ts` gets
   regenerated from the live schema (currently a loose placeholder) and
   the Clients/Leads stores get rewritten to call Supabase instead of
   holding local seed data — the actual "make it real" step.

## Rollout order (unchanged from the original plan)

Clients & Leads (this migration) -> Projects & Tasks -> Employees/HR ->
Finance -> Inbox/Assets/Reports/Settings/Operations. Each module: design
its tables -> write RLS policies -> wire the existing store/screens to
Supabase -> verify -> move to the next module.
