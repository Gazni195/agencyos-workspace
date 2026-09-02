import { createFileRoute } from "@tanstack/react-router";
import { ClientsIndexPage } from "@/modules/clients/frontend/pages/ClientsIndexPage";

export const Route = createFileRoute("/clients/")({
  head: () => ({
    meta: [
      { title: "Clients — AgencyOS" },
      { name: "description", content: "Search, filter and manage every AgencyOS client account." },
      { property: "og:title", content: "Clients — AgencyOS" },
      {
        property: "og:description",
        content: "Search, filter and manage every AgencyOS client account.",
      },
    ],
  }),
  component: ClientsIndexPage,
});
