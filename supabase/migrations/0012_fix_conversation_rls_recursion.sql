-- Fix: conversation_participants' own SELECT policy checks membership by
-- querying conversation_participants itself, which re-triggers that same
-- SELECT policy on every nested evaluation — Postgres detects this as
-- infinite recursion (42P17) and refuses the query. Caught by directly
-- exercising the policies as an authenticated user (not just reading the
-- SQL), the same way the earlier participant-insert-ordering bug was
-- found.
--
-- Same fix shape as has_permission()/current_role_id(): a SECURITY
-- DEFINER helper in the `private` schema does the membership lookup with
-- RLS bypassed (it runs as the function owner, not the querying role),
-- so the policies that call it no longer recurse into themselves.

create or replace function private.is_conversation_participant(p_conversation_id uuid, p_profile_id uuid)
returns boolean as $$
  select exists (
    select 1 from conversation_participants
    where conversation_id = p_conversation_id and profile_id = p_profile_id
  );
$$ language sql stable security definer set search_path = public;

grant execute on function private.is_conversation_participant(uuid, uuid) to authenticated;

drop policy "conversations viewable by participants" on conversations;
create policy "conversations viewable by participants" on conversations for select using (
  private.is_conversation_participant(conversations.id, auth.uid())
);

drop policy "conversations updatable by participants" on conversations;
create policy "conversations updatable by participants" on conversations for update using (
  private.is_conversation_participant(conversations.id, auth.uid())
);

drop policy "conversation_participants viewable by participants" on conversation_participants;
create policy "conversation_participants viewable by participants" on conversation_participants for select using (
  private.is_conversation_participant(conversation_participants.conversation_id, auth.uid())
);

drop policy "conversation_participants insertable by participants" on conversation_participants;
create policy "conversation_participants insertable by participants" on conversation_participants for insert with check (
  profile_id = auth.uid()
  or private.is_conversation_participant(conversation_participants.conversation_id, auth.uid())
);

drop policy "messages viewable by participants" on messages;
create policy "messages viewable by participants" on messages for select using (
  private.is_conversation_participant(messages.conversation_id, auth.uid())
);

drop policy "messages insertable by participants" on messages;
create policy "messages insertable by participants" on messages for insert with check (
  author_id = auth.uid()
  and private.is_conversation_participant(messages.conversation_id, auth.uid())
);
