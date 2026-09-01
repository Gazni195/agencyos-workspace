import { createFileRoute } from "@tanstack/react-router";
import { documents } from "@/modules/employees/types";
import { DocumentsPage } from "@/modules/employees/frontend/pages/DocumentsPage";

export const Route = createFileRoute("/employees/documents")({
  head: () => ({
    meta: [
      { title: "Employee Documents — AgencyOS" },
      { name: "description", content: "Organize employee contracts, policies and HR documents." },
      { property: "og:title", content: "Employee Documents — AgencyOS" },
      {
        property: "og:description",
        content: "Organize employee contracts, policies and HR documents.",
      },
    ],
  }),
  component: DocumentsPage,
});
