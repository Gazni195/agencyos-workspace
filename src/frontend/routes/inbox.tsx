import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { InboxLayout } from "@/modules/inbox/frontend/pages/InboxLayout";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — AgencyOS" },
      {
        name: "description",
        content: "Keep up with agency conversations and notifications in AgencyOS.",
      },
      { property: "og:title", content: "Inbox — AgencyOS" },
      {
        property: "og:description",
        content: "Keep up with agency conversations and notifications in AgencyOS.",
      },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Inbox">
      <InboxLayout />
    </RequireModuleAccess>
  ),
});
