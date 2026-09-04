-- Security hardening flagged by Supabase's advisor after 0001/0002 landed:
-- 1. Every function here had a mutable search_path, letting a malicious
--    search_path override which "public"-qualified objects it resolves —
--    pin it explicitly.
-- 2. current_role_id/has_permission/handle_new_user are SECURITY DEFINER
--    helpers meant to be called *from inside RLS policies*, not directly
--    over the API. Supabase auto-exposes every public function as a
--    /rest/v1/rpc/<name> endpoint, so revoke direct EXECUTE from anon/
--    authenticated and only let the functions that actually need to call
--    them (RLS policy evaluation, the auth trigger) do so.

alter function current_role_id() set search_path = public;
alter function has_permission(permission_module, text) set search_path = public;
alter function handle_new_user() set search_path = public;
alter function set_updated_at() set search_path = public;

revoke execute on function current_role_id() from anon, authenticated;
revoke execute on function has_permission(permission_module, text) from anon, authenticated;
revoke execute on function handle_new_user() from anon, authenticated;
