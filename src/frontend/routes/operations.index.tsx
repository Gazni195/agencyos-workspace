import { createFileRoute } from "@tanstack/react-router";
import { OperationsOverviewPage } from "@/modules/operations/frontend/pages/OperationsOverviewPage";

export const Route = createFileRoute("/operations/")({
  head: () => ({
    meta: [
      { title: "Operations Overview — AgencyOS" },
      {
        name: "description",
        content: "Pending, in-review, completed and delayed work at a glance.",
      },
    ],
  }),
  component: OperationsOverviewPage,
});
