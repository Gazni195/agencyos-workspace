import { createFileRoute } from "@tanstack/react-router";
import { OrganizationPage } from "@/modules/settings/frontend/pages/OrganizationPage";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "Organization — AgencyOS Settings" },
      { name: "description", content: "Departments and designations across the agency." },
    ],
  }),
  component: OrganizationPage,
});
