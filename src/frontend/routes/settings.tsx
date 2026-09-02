import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { SettingsLayout } from "@/modules/settings/frontend/pages/SettingsLayout";

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
