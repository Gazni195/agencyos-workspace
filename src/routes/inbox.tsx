import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

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

function InboxLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader title="Inbox" description="Your communications workspace." />
      <Outlet />
    </section>
  );
}
