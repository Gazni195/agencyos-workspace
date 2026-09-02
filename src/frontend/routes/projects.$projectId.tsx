import { createFileRoute } from "@tanstack/react-router";
import { milestones } from "@/modules/projects/types";
import { ProjectDetailPage } from "@/modules/projects/frontend/pages/ProjectDetailPage";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Details — AgencyOS" },
      {
        name: "description",
        content: "Review project progress, budget, milestones and delivery health.",
      },
      { property: "og:title", content: "Project Details — AgencyOS" },
      {
        property: "og:description",
        content: "Review project progress, budget, milestones and delivery health.",
      },
    ],
  }),
  component: ProjectDetailPage,
});
