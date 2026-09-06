-- Follow-up to 0003: revoking EXECUTE from the *named* roles (anon,
-- authenticated) wasn't enough — Postgres grants EXECUTE to PUBLIC by
-- default when a function is created, and every role implicitly inherits
-- PUBLIC's privileges, so the advisor kept flagging current_role_id(),
-- has_permission() and handle_new_user() as callable via
-- /rest/v1/rpc/<name> even after 0003.
--
-- The real fix: PostgREST only exposes functions that live in a schema
-- listed in the project's Data API "exposed schemas" setting (public, by
-- default). Moving these three helpers into a `private` schema removes
-- them from that surface entirely, while leaving them fully usable from
-- inside Row Level Security policies and the auth trigger — Postgres
-- resolves function calls inside already-created policies/triggers by
-- OID, not by name lookup, so existing policies keep working unchanged.
--
-- current_role_id() and has_permission() still need to run for every
-- signed-in (and anonymous) request, since every module's RLS policy
-- calls one of them — so EXECUTE is re-granted to authenticated and anon
-- on the *relocated* copies. handle_new_user() is only ever invoked by
-- the on_auth_user_created trigger (not called directly), so it gets no
-- such grant.
--
-- From this migration on, new policies must call these two as
-- private.current_role_id() / private.has_permission(...) — they're no
-- longer resolvable unqualified from the default search_path.

create schema if not exists private;

alter function current_role_id() set schema private;
alter function has_permission(permission_module, text) set schema private;
alter function handle_new_user() set schema private;

grant execute on function private.current_role_id() to authenticated, anon;
grant execute on function private.has_permission(permission_module, text) to authenticated, anon;
