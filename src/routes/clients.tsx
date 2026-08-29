import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients — AgencyOS" },
      { name: "description", content: "Manage AgencyOS client relationships and accounts." },
      { property: "og:title", content: "Clients — AgencyOS" },
      { property: "og:description", content: "Manage AgencyOS client relationships and accounts." },
    ],
  }),
  component: () => <Outlet />,
});
