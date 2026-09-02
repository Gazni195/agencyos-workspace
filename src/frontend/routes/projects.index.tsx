import { createFileRoute } from "@tanstack/react-router";
import { ProjectsIndexPage } from "@/modules/projects/frontend/pages/ProjectsIndexPage";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — AgencyOS" },
      { name: "description", content: "Plan and track every AgencyOS project in one workspace." },
      { property: "og:title", content: "Projects — AgencyOS" },
      {
        property: "og:description",
        content: "Plan and track every AgencyOS project in one workspace.",
      },
    ],
  }),
  component: ProjectsIndexPage,
});
