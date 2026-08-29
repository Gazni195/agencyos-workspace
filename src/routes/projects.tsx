import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — AgencyOS" },
      { name: "description", content: "Plan and manage agency projects in AgencyOS." },
      { property: "og:title", content: "Projects — AgencyOS" },
      { property: "og:description", content: "Plan and manage agency projects in AgencyOS." },
    ],
  }),
  component: () => <Outlet />,
});
