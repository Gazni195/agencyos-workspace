import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads — AgencyOS" },
      { name: "description", content: "Track and manage the agency's lead pipeline in AgencyOS." },
      { property: "og:title", content: "Leads — AgencyOS" },
      {
        property: "og:description",
        content: "Track and manage the agency's lead pipeline in AgencyOS.",
      },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Leads">
      <Outlet />
    </RequireModuleAccess>
  ),
});
