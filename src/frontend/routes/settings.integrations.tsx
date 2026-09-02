import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsPage } from "@/modules/settings/frontend/pages/IntegrationsPage";

export const Route = createFileRoute("/settings/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — AgencyOS Settings" },
      { name: "description", content: "Connect AgencyOS to the tools your team already uses." },
    ],
  }),
  component: IntegrationsPage,
});
