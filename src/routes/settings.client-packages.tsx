import { createFileRoute } from "@tanstack/react-router";
import { ClientPackagesPage } from "@/modules/settings/frontend/pages/ClientPackagesPage";

export const Route = createFileRoute("/settings/client-packages")({
  head: () => ({
    meta: [
      { title: "Client Packages — AgencyOS Settings" },
      { name: "description", content: "Manage the retainer and one-time package catalog." },
    ],
  }),
  component: ClientPackagesPage,
});
