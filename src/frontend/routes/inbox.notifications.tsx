import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/modules/inbox/frontend/pages/NotificationsPage";

export const Route = createFileRoute("/inbox/notifications")({
  component: NotificationsPage,
});
