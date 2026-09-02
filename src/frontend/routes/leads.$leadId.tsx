import { createFileRoute } from "@tanstack/react-router";
import { LeadDetailPage } from "@/modules/leads/frontend/pages/LeadDetailPage";

export const Route = createFileRoute("/leads/$leadId")({
  head: () => ({
    meta: [
      { title: "Lead Details — AgencyOS" },
      {
        name: "description",
        content: "Review a lead's contact details, pipeline stage and activity.",
      },
      { property: "og:title", content: "Lead Details — AgencyOS" },
      {
        property: "og:description",
        content: "Review a lead's contact details, pipeline stage and activity.",
      },
    ],
  }),
  component: LeadDetailPage,
});
