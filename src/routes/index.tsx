import { createFileRoute } from "@tanstack/react-router";
import { Index } from "@/modules/dashboard/frontend/pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgencyOS" },
      {
        name: "description",
        content: "Executive overview of revenue, pipeline, delivery and team health.",
      },
    ],
  }),
  component: Index,
});
