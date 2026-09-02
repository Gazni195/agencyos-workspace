import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { cn } from "@/shared/frontend/utils/utils";

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

const tabs = [
  { label: "Organization", to: "/settings" },
  { label: "Roles & Permissions", to: "/settings/roles" },
  { label: "Client Packages", to: "/settings/client-packages" },
  { label: "Integrations", to: "/settings/integrations" },
  { label: "Workflows", to: "/settings/workflows" },
  { label: "Notifications", to: "/settings/notifications" },
] as const;

function SettingsLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Settings"
        description="Configure your workspace, roles and integrations."
      />
      <nav
        aria-label="Settings sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/settings" }}
            className="shrink-0 rounded-t-lg border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{
              className: cn(
                "shrink-0 rounded-t-lg border-b-2 border-primary px-3.5 py-2.5 text-sm font-semibold text-foreground",
              ),
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </section>
  );
}
