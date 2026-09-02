import { createFileRoute } from "@tanstack/react-router";
import { OperationsClientsPage } from "@/modules/operations/frontend/pages/OperationsClientsPage";

export const Route = createFileRoute("/operations/clients")({
  head: () => ({
    meta: [
      { title: "Clients Waiting — AgencyOS" },
      {
        name: "description",
        content: "Which clients have delayed work or deliverables awaiting review.",
      },
    ],
  }),
  component: OperationsClientsPage,
});
