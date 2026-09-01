// Types & seed data for the Inbox module.
export type Message = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  body: string;
  time: string;
};

export type Conversation = {
  id: string;
  subject: string;
  participants: { id: string; name: string; initials: string }[];
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  mention: boolean;
  folder: "team" | "client" | "system";
  messages: Message[];
};

export const conversations: Conversation[] = [];

export type Notification = {
  id: string;
  icon: "mention" | "approval" | "task" | "system" | "leave";
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [];
