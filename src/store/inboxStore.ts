// Client-side Inbox state. Seeded from src/data/workspace.ts. Mutations
// live only in memory for this session — swap for API calls later
// without touching the UI layer.
import { create } from "zustand";
import {
  conversations as seedConversations,
  notifications as seedNotifications,
  type Conversation,
  type Message,
  type Notification,
} from "@/data/workspace";

type InboxState = {
  conversations: Conversation[];
  markConversationRead: (id: string) => void;
  toggleStar: (id: string) => void;
  sendMessage: (
    conversationId: string,
    body: string,
    author: { id: string; name: string; initials: string },
  ) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

export const useInboxStore = create<InboxState>((set) => ({
  conversations: seedConversations,
  markConversationRead: (id) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    })),
  toggleStar: (id) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)),
    })),
  sendMessage: (conversationId, body, author) =>
    set((s) => ({
      conversations: s.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const message: Message = {
          id: `m-${c.id}-${c.messages.length + 1}`,
          authorId: author.id,
          authorName: author.name,
          authorInitials: author.initials,
          body,
          time: "Just now",
        };
        return {
          ...c,
          messages: [...c.messages, message],
          preview: body,
          time: "Just now",
          unread: false,
        };
      }),
    })),
  notifications: seedNotifications,
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));
