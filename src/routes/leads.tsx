import { createFileRoute, Outlet } from "@tanstack/react-router";

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
  component: () => <Outlet />,
});
