import { createFileRoute } from "@tanstack/react-router";
import { NotificationsSettingsPage } from "@/modules/settings/frontend/pages/NotificationsSettingsPage";

export const Route = createFileRoute("/settings/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — AgencyOS Settings" },
      { name: "description", content: "Choose which events notify your team." },
    ],
  }),
  component: NotificationsSettingsPage,
});
