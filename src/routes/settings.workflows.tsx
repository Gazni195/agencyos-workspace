import { createFileRoute } from "@tanstack/react-router";
import { WorkflowsPage } from "@/modules/settings/frontend/pages/WorkflowsPage";

export const Route = createFileRoute("/settings/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — AgencyOS Settings" },
      { name: "description", content: "Configure who approves each agency workflow." },
    ],
  }),
  component: WorkflowsPage,
});
