import { createFileRoute } from "@tanstack/react-router";
import { OperationsDeliverablesPage } from "@/modules/operations/frontend/pages/OperationsDeliverablesPage";

export const Route = createFileRoute("/operations/deliverables")({
  head: () => ({
    meta: [
      { title: "Deliverables — AgencyOS" },
      {
        name: "description",
        content: "Client-facing outputs awaiting internal or client review.",
      },
    ],
  }),
  component: OperationsDeliverablesPage,
});
