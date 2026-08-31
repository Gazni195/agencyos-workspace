import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients — AgencyOS" },
      { name: "description", content: "Manage AgencyOS client relationships and accounts." },
      { property: "og:title", content: "Clients — AgencyOS" },
      { property: "og:description", content: "Manage AgencyOS client relationships and accounts." },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Clients">
      <Outlet />
    </RequireModuleAccess>
  ),
});
