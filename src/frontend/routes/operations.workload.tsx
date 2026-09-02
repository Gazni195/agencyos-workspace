import { createFileRoute } from "@tanstack/react-router";
import { OperationsWorkloadPage } from "@/modules/operations/frontend/pages/OperationsWorkloadPage";

export const Route = createFileRoute("/operations/workload")({
  head: () => ({
    meta: [
      { title: "Team Workload — AgencyOS" },
      { name: "description", content: "Who's working on what, and who's overloaded or idle." },
    ],
  }),
  component: OperationsWorkloadPage,
});
