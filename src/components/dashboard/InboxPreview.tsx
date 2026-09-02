import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useInboxStore } from "@/store/inboxStore";
import { Mail } from "lucide-react";

export function InboxPreview() {
  const conversations = useInboxStore((s) => s.conversations);
  const unread = conversations
    .filter((c) => c.unread)
    .map((c) => ({
      id: c.id,
      from: c.participants[0]?.name ?? "Unknown",
      subject: c.subject,
      preview: c.preview,
      time: c.time,
    }));
  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Unread inbox</CardTitle>
          <CardDescription>{unread.length} unread messages</CardDescription>
        </div>
        <Link to="/inbox" className="text-xs font-medium text-primary hover:underline">
          Open inbox
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {unread.length === 0 && (
          <p className="text-sm text-muted-foreground">You're all caught up.</p>
        )}
        {unread.map((m) => (
          <Link
            key={m.id}
            to="/inbox"
            className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50"
          >
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium">{m.from}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{m.time}</span>
              </div>
              <p className="truncate text-xs">{m.subject}</p>
              <p className="truncate text-xs text-muted-foreground">{m.preview}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
