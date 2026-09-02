import { useState } from "react";
import { Search, Send, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { Badge } from "@/shared/frontend/components/ui/badge";
import { Button } from "@/shared/frontend/components/ui/button";
import { Input } from "@/shared/frontend/components/ui/input";
import { Textarea } from "@/shared/frontend/components/ui/textarea";
import { EmptyState } from "@/shared/frontend/components/EmptyState";
import { cn } from "@/shared/frontend/utils/utils";
import { useInboxStore } from "@/modules/inbox/frontend/store/inboxStore";
import type { Conversation } from "@/modules/inbox/types";

export const CURRENT_USER = { id: "self", name: "Daniel Reyes", initials: "DR" };

export const folders = [
  { id: "all", label: "All" },
  { id: "team", label: "Team" },
  { id: "client", label: "Client" },
  { id: "system", label: "System" },
] as const;

export type FolderId = (typeof folders)[number]["id"];

export function MessagesPage() {
  const conversations = useInboxStore((s) => s.conversations);
  const markConversationRead = useInboxStore((s) => s.markConversationRead);
  const toggleStar = useInboxStore((s) => s.toggleStar);
  const sendMessage = useInboxStore((s) => s.sendMessage);

  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null);
  const [folder, setFolder] = useState<FolderId>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const filtered = conversations.filter((c) => {
    if (folder !== "all" && c.folder !== folder) return false;
    if (unreadOnly && !c.unread) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (!c.subject.toLowerCase().includes(q) && !c.preview.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  const openConversation = (c: Conversation) => {
    setSelectedId(c.id);
    if (c.unread) markConversationRead(c.id);
  };

  const handleSend = () => {
    if (!selected || !draft.trim()) return;
    sendMessage(selected.id, draft.trim(), CURRENT_USER);
    setDraft("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <div className="surface-card flex max-h-[calc(100vh-13rem)] min-h-[28rem] flex-col overflow-hidden">
        <div className="space-y-3 border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFolder(f.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  folder === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setUnreadOnly((v) => !v)}
              className={cn(
                "ml-auto rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                unreadOnly
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              Unread
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={Users}
                title="No conversations"
                description="Try a different filter or search term."
              />
            </div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => openConversation(c)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border/60 px-3.5 py-3 text-left transition-colors hover:bg-muted/50",
                selected?.id === c.id && "bg-muted",
              )}
            >
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-primary-soft text-accent-foreground">
                  {c.participants[0]?.initials ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>
                    {c.subject}
                  </p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{c.preview}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {c.unread && <span className="size-1.5 rounded-full bg-primary" />}
                  {c.mention && (
                    <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                      @mention
                    </Badge>
                  )}
                  {c.starred && <Star className="size-3 fill-amber-400 text-amber-400" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card flex max-h-[calc(100vh-13rem)] min-h-[28rem] flex-col overflow-hidden">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={Users}
              title="Select a conversation"
              description="Choose a thread from the list to read it."
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-border p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">{selected.subject}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {selected.participants.map((p) => p.name).join(", ")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={selected.starred ? "Unstar conversation" : "Star conversation"}
                onClick={() => toggleStar(selected.id)}
              >
                <Star
                  className={cn("size-4", selected.starred && "fill-amber-400 text-amber-400")}
                />
              </Button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {selected.messages.map((m) => {
                const isSelf = m.authorId === CURRENT_USER.id;
                return (
                  <div key={m.id} className={cn("flex gap-2.5", isSelf && "flex-row-reverse")}>
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback
                        className={
                          isSelf
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary-soft text-accent-foreground"
                        }
                      >
                        {m.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[75%]", isSelf && "items-end text-right")}>
                      <div
                        className={cn("flex items-baseline gap-2", isSelf && "flex-row-reverse")}
                      >
                        <p className="text-xs font-medium">{m.authorName}</p>
                        <p className="text-[11px] text-muted-foreground">{m.time}</p>
                      </div>
                      <div
                        className={cn(
                          "mt-1 rounded-2xl px-3.5 py-2 text-sm",
                          isSelf ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        {m.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-end gap-2 border-t border-border p-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Write a reply…"
                className="min-h-10 flex-1 resize-none"
                rows={1}
              />
              <Button
                size="icon"
                aria-label="Send reply"
                onClick={handleSend}
                disabled={!draft.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
