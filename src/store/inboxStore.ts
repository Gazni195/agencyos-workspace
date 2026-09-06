// Client-side Inbox state, backed by Supabase's notifications/
// notification_reads/conversations/conversation_participants/messages
// tables (see supabase/migrations/0011_inbox.sql). Notifications are a
// shared workspace feed with per-account read receipts; conversations are
// real multi-party threads visible only to their participants. The
// exported Notification/Conversation shapes stay the same as before this
// wiring — `read`/`unread` are the current account's own state, derived
// server-side data rather than a global flag.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useSessionStore } from "./sessionStore";
import { type Conversation, type Message, type Notification } from "@/data/workspace";

type NotificationRow = {
  id: string;
  icon: Notification["icon"];
  title: string;
  detail: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
};

type ConversationRow = {
  id: string;
  subject: string;
  folder: Conversation["folder"];
  conversation_participants: {
    profile_id: string;
    starred: boolean;
    last_read_at: string | null;
    profiles: { id: string; full_name: string } | null;
  }[];
  messages: MessageRow[];
};

const CONVERSATION_SELECT =
  "id, subject, folder, conversation_participants(profile_id, starred, last_read_at, profiles(id, full_name)), messages(id, author_id, body, created_at)";

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function timeAgo(iso: string) {
  return iso.slice(0, 10);
}

function conversationFromRow(row: ConversationRow, selfId: string): Conversation {
  const self = row.conversation_participants.find((p) => p.profile_id === selfId);
  const messages: Message[] = [...row.messages]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((m) => {
      const author = row.conversation_participants.find((p) => p.profile_id === m.author_id);
      const name = author?.profiles?.full_name ?? "Unknown";
      return {
        id: m.id,
        authorId: m.author_id,
        authorName: name,
        authorInitials: initialsOf(name),
        body: m.body,
        time: timeAgo(m.created_at),
      };
    });
  const lastMessage = messages[messages.length - 1];
  const unread = messages.some(
    (m) =>
      m.authorId !== selfId && (!self?.last_read_at || m.time > self.last_read_at.slice(0, 10)),
  );
  return {
    id: row.id,
    subject: row.subject,
    participants: row.conversation_participants
      .filter((p) => p.profile_id !== selfId)
      .map((p) => ({
        id: p.profile_id,
        name: p.profiles?.full_name ?? "Unknown",
        initials: initialsOf(p.profiles?.full_name ?? "?"),
      })),
    preview: lastMessage?.body ?? "",
    time: lastMessage?.time ?? "",
    unread,
    starred: self?.starred ?? false,
    mention: false,
    folder: row.folder,
    messages,
  };
}

export type NewConversationInput = {
  subject: string;
  folder: Conversation["folder"];
  participantProfileIds: string[];
  firstMessage: string;
};

type InboxState = {
  conversations: Conversation[];
  loaded: boolean;
  fetchConversations: () => Promise<void>;
  markConversationRead: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  sendMessage: (conversationId: string, body: string) => Promise<void>;
  createConversation: (input: NewConversationInput) => Promise<Conversation | null>;

  notifications: Notification[];
  notificationsLoaded: boolean;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, "id" | "read" | "time">) => Promise<void>;
};

export const useInboxStore = create<InboxState>((set, get) => ({
  conversations: [],
  loaded: false,
  fetchConversations: async () => {
    const selfId = useSessionStore.getState().profile?.id;
    if (!selfId) return;
    const { data, error } = await supabase
      .from("conversations")
      .select(CONVERSATION_SELECT)
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Failed to load conversations", error);
      set({ loaded: true });
      return;
    }
    set({
      conversations: (data as unknown as ConversationRow[]).map((r) =>
        conversationFromRow(r, selfId),
      ),
      loaded: true,
    });
  },
  markConversationRead: async (id) => {
    const selfId = useSessionStore.getState().profile?.id;
    if (!selfId) return;
    const { error } = await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", id)
      .eq("profile_id", selfId);
    if (error) {
      console.error("Failed to mark conversation read", error);
      return;
    }
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    }));
  },
  toggleStar: async (id) => {
    const selfId = useSessionStore.getState().profile?.id;
    if (!selfId) return;
    const conversation = get().conversations.find((c) => c.id === id);
    if (!conversation) return;
    const starred = !conversation.starred;
    const { error } = await supabase
      .from("conversation_participants")
      .update({ starred })
      .eq("conversation_id", id)
      .eq("profile_id", selfId);
    if (error) {
      console.error("Failed to update conversation", error);
      return;
    }
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, starred } : c)),
    }));
  },
  sendMessage: async (conversationId, body) => {
    const profile = useSessionStore.getState().profile;
    if (!profile) return;
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, author_id: profile.id, body })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to send message", error);
      return;
    }
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
    const row = data as MessageRow;
    const message: Message = {
      id: row.id,
      authorId: profile.id,
      authorName: profile.fullName,
      authorInitials: initialsOf(profile.fullName),
      body: row.body,
      time: timeAgo(row.created_at),
    };
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], preview: body, time: message.time }
          : c,
      ),
    }));
  },
  createConversation: async (input) => {
    const profile = useSessionStore.getState().profile;
    if (!profile) return null;
    const id = crypto.randomUUID();
    const { error: convError } = await supabase
      .from("conversations")
      .insert({ id, subject: input.subject, folder: input.folder });
    if (convError) {
      console.error("Failed to create conversation", convError);
      return null;
    }
    // Self first, as its own statement: the insert policy for every other
    // participant relies on a conversation_participants row for the acting
    // user already existing, which a batched multi-row insert wouldn't see
    // yet (RLS checks see the pre-statement snapshot, not sibling rows
    // being inserted by the same statement).
    const { error: selfError } = await supabase
      .from("conversation_participants")
      .insert({ conversation_id: id, profile_id: profile.id });
    if (selfError) {
      console.error("Failed to join conversation", selfError);
      return null;
    }
    if (input.participantProfileIds.length > 0) {
      const { error: participantsError } = await supabase.from("conversation_participants").insert(
        input.participantProfileIds.map((profileId) => ({
          conversation_id: id,
          profile_id: profileId,
        })),
      );
      if (participantsError) {
        console.error("Failed to add participants", participantsError);
        return null;
      }
    }
    if (input.firstMessage.trim()) {
      const { error: messageError } = await supabase
        .from("messages")
        .insert({ conversation_id: id, author_id: profile.id, body: input.firstMessage.trim() });
      if (messageError) console.error("Failed to send first message", messageError);
    }
    await get().fetchConversations();
    return get().conversations.find((c) => c.id === id) ?? null;
  },

  notifications: [],
  notificationsLoaded: false,
  fetchNotifications: async () => {
    const selfId = useSessionStore.getState().profile?.id;
    if (!selfId) return;
    const [{ data: notificationRows, error: notifError }, { data: readRows, error: readError }] =
      await Promise.all([
        supabase.from("notifications").select("*").order("created_at", { ascending: false }),
        supabase.from("notification_reads").select("notification_id").eq("profile_id", selfId),
      ]);
    if (notifError) {
      console.error("Failed to load notifications", notifError);
      set({ notificationsLoaded: true });
      return;
    }
    if (readError) console.error("Failed to load read receipts", readError);
    const readIds = new Set((readRows ?? []).map((r) => r.notification_id as string));
    set({
      notifications: (notificationRows as NotificationRow[]).map((n) => ({
        id: n.id,
        icon: n.icon,
        title: n.title,
        detail: n.detail,
        time: timeAgo(n.created_at),
        read: readIds.has(n.id),
      })),
      notificationsLoaded: true,
    });
  },
  markNotificationRead: async (id) => {
    const selfId = useSessionStore.getState().profile?.id;
    if (!selfId) return;
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
    const { error } = await supabase
      .from("notification_reads")
      .insert({ notification_id: id, profile_id: selfId });
    if (error && error.code !== "23505") {
      console.error("Failed to mark notification read", error);
    }
  },
  markAllNotificationsRead: async () => {
    const selfId = useSessionStore.getState().profile?.id;
    if (!selfId) return;
    const unreadIds = get()
      .notifications.filter((n) => !n.read)
      .map((n) => n.id);
    if (unreadIds.length === 0) return;
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
    const { error } = await supabase
      .from("notification_reads")
      .insert(unreadIds.map((notification_id) => ({ notification_id, profile_id: selfId })));
    if (error && error.code !== "23505") {
      console.error("Failed to mark all notifications read", error);
    }
  },
  addNotification: async (notification) => {
    const { data, error } = await supabase
      .from("notifications")
      .insert({ icon: notification.icon, title: notification.title, detail: notification.detail })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to create notification", error);
      return;
    }
    const row = data as NotificationRow;
    set((s) => ({
      notifications: [
        {
          id: row.id,
          icon: row.icon,
          title: row.title,
          detail: row.detail,
          time: "Just now",
          read: false,
        },
        ...s.notifications,
      ],
    }));
  },
}));
