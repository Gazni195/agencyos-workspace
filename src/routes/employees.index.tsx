import { createFileRoute } from "@tanstack/react-router";
import { type Employee } from "@/modules/employees/types";
import { DirectoryPage } from "@/modules/employees/frontend/pages/DirectoryPage";

export const Route = createFileRoute("/employees/")({
  head: () => ({
    meta: [
      { title: "Employee Directory — AgencyOS" },
      { name: "description", content: "Browse and manage every employee in your agency." },
      { property: "og:title", content: "Employee Directory — AgencyOS" },
      { property: "og:description", content: "Browse and manage every employee in your agency." },
    ],
  }),
  component: DirectoryPage,
});
