-- Inbox module — team messaging + the shared notification feed. Matches
-- src/data/workspace.ts's Conversation/Message/Notification shapes, but
-- normalized for real multi-account use:
--
-- Notifications are a shared, workspace-wide activity feed (every module's
-- store already fires one on real events — new lead, task assigned,
-- invoice paid, etc.) rather than per-recipient mail: there's no link
-- between an Employee record and the profile that signs in as them yet, so
-- true per-recipient targeting isn't buildable honestly. What *is* real is
-- read state — notification_reads records who has seen which notification,
-- so "mark read" only affects your own view.
--
-- Conversations are real multi-party threads. conversation_participants is
-- the join table (who's in it, their own starred flag, and last_read_at —
-- unread is derived by comparing that to the latest message, not stored as
-- a flag). Only participants can read or post in a conversation (RLS
-- below), matching a private-thread expectation.
--
-- "mention" (the @mention badge in the existing UI) has no authoring path
-- — there's no @mention autocomplete anywhere — so it isn't modeled here;
-- the frontend keeps exposing that field as always-false rather than
-- faking detection with no real input.
--
-- Creating a conversation needs a client-generated id (crypto.randomUUID())
-- rather than relying on the table's default: the conversations SELECT
-- policy requires a conversation_participants row to already exist, so an
-- insert().select() on conversations done before any participant row
-- exists would return nothing under RLS. Insert the conversation with a
-- known id, then the participant rows, then read it back.

create table notifications (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'system',
  title text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create table notification_reads (
  notification_id uuid not null references notifications(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, profile_id)
);

create type conversation_folder as enum ('team', 'client', 'system');

create table conversations (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  folder conversation_folder not null default 'team',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table conversation_participants (
  conversation_id uuid not null references conversations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  starred boolean not null default false,
  last_read_at timestamptz,
  primary key (conversation_id, profile_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;
alter table notification_reads enable row level security;
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;

-- Notifications: shared feed, any signed-in account can see and post to it
-- (every store's write actions run as the acting user, not an admin).
create policy "notifications viewable" on notifications for select using (auth.uid() is not null);
create policy "notifications insertable" on notifications for insert with check (auth.uid() is not null);

-- Read receipts: only ever visible/writable for your own account.
create policy "notification_reads own" on notification_reads for select using (auth.uid() = profile_id);
create policy "notification_reads insertable" on notification_reads for insert with check (auth.uid() = profile_id);

-- Conversations/messages: visible only to participants. A new conversation
-- has no participant rows yet at the instant it's inserted, so creation
-- itself just requires being signed in — participants get added right
-- after in the same client-side flow.
create policy "conversations viewable by participants" on conversations for select using (
  exists (select 1 from conversation_participants cp where cp.conversation_id = conversations.id and cp.profile_id = auth.uid())
);
create policy "conversations insertable" on conversations for insert with check (auth.uid() is not null);
create policy "conversations updatable by participants" on conversations for update using (
  exists (select 1 from conversation_participants cp where cp.conversation_id = conversations.id and cp.profile_id = auth.uid())
);

create policy "conversation_participants viewable by participants" on conversation_participants for select using (
  exists (select 1 from conversation_participants cp where cp.conversation_id = conversation_participants.conversation_id and cp.profile_id = auth.uid())
);
create policy "conversation_participants insertable by participants" on conversation_participants for insert with check (
  profile_id = auth.uid()
  or exists (select 1 from conversation_participants cp where cp.conversation_id = conversation_participants.conversation_id and cp.profile_id = auth.uid())
);
create policy "conversation_participants updatable own row" on conversation_participants for update using (profile_id = auth.uid());

create policy "messages viewable by participants" on messages for select using (
  exists (select 1 from conversation_participants cp where cp.conversation_id = messages.conversation_id and cp.profile_id = auth.uid())
);
create policy "messages insertable by participants" on messages for insert with check (
  author_id = auth.uid()
  and exists (select 1 from conversation_participants cp where cp.conversation_id = messages.conversation_id and cp.profile_id = auth.uid())
);

create trigger conversations_set_updated_at
  before update on conversations
  for each row execute function set_updated_at();
