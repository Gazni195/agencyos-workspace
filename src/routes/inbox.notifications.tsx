import { createFileRoute } from "@tanstack/react-router";
import { AtSign, Bell, CalendarCheck, CheckCircle2, ListTodo, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/frontend/components/ui/button";
import { EmptyState } from "@/shared/frontend/components/EmptyState";
import { cn } from "@/shared/frontend/utils/utils";
import { useInboxStore } from "@/modules/inbox/frontend/store/inboxStore";
import type { Notification } from "@/modules/inbox/types";

export const Route = createFileRoute("/inbox/notifications")({
  component: NotificationsPage,
});

const ICONS: Record<Notification["icon"], LucideIcon> = {
  mention: AtSign,
  approval: CheckCircle2,
  task: ListTodo,
  system: Server,
  leave: CalendarCheck,
};

function NotificationsPage() {
  const notifications = useInboxStore((s) => s.notifications);
  const markNotificationRead = useInboxStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useInboxStore((s) => s.markAllNotificationsRead);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <p className="font-semibold">All notifications</p>
          <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllNotificationsRead}
          disabled={unreadCount === 0}
        >
          Mark all read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <ul>
          {notifications.map((n) => {
            const Icon = ICONS[n.icon];
            return (
              <li key={n.id} className="border-b border-border/60 last:border-0">
                <button
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
                    !n.read && "bg-primary-soft/40",
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("truncate text-sm", !n.read && "font-semibold")}>
                        {n.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{n.detail}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
