import { createFileRoute } from "@tanstack/react-router";
import { ClientDetailPage } from "@/modules/clients/frontend/pages/ClientDetailPage";

export const Route = createFileRoute("/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Client Details — AgencyOS" },
      {
        name: "description",
        content: "Review a client's account, retainers, projects and activity.",
      },
      { property: "og:title", content: "Client Details — AgencyOS" },
      {
        property: "og:description",
        content: "Review a client's account, retainers, projects and activity.",
      },
    ],
  }),
  component: ClientDetailPage,
});
