import { createFileRoute } from "@tanstack/react-router";
import { performance } from "@/modules/employees/types";
import { PerformancePage } from "@/modules/employees/frontend/pages/PerformancePage";

export const Route = createFileRoute("/employees/performance")({
  head: () => ({
    meta: [
      { title: "Performance — AgencyOS" },
      { name: "description", content: "Track employee goals, reviews and performance progress." },
      { property: "og:title", content: "Performance — AgencyOS" },
      {
        property: "og:description",
        content: "Track employee goals, reviews and performance progress.",
      },
    ],
  }),
  component: PerformancePage,
});
