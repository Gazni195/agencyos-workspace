import { createFileRoute } from "@tanstack/react-router";
import { ProjectsReportPage } from "@/modules/reports/frontend/pages/ProjectsReportPage";

export const Route = createFileRoute("/reports/projects")({
  head: () => ({
    meta: [
      { title: "Project Reports — AgencyOS" },
      { name: "description", content: "Delivery status, budget variance and on-time performance." },
    ],
  }),
  component: ProjectsReportPage,
});
