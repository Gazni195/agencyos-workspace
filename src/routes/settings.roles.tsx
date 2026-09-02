import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "@/modules/settings/frontend/pages/RolesPage";

export const Route = createFileRoute("/settings/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Permissions — AgencyOS Settings" },
      { name: "description", content: "Manage role access across every module." },
    ],
  }),
  component: RolesPage,
});
