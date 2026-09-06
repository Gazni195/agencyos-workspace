import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AgencyOS" },
      { name: "description", content: "Configure your AgencyOS workspace settings." },
      { property: "og:title", content: "Settings — AgencyOS" },
      { property: "og:description", content: "Configure your AgencyOS workspace settings." },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Settings">
      <SettingsLayout />
    </RequireModuleAccess>
  ),
});

function SettingsLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Settings"
        description="Configure your workspace, roles and integrations."
      />
      <Outlet />
    </section>
  );
}
