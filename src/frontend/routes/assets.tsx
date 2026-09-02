import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { AssetsPage } from "@/modules/assets/frontend/pages/AssetsPage";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — AgencyOS" },
      { name: "description", content: "Organize agency assets and resources in AgencyOS." },
      { property: "og:title", content: "Assets — AgencyOS" },
      { property: "og:description", content: "Organize agency assets and resources in AgencyOS." },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Assets">
      <AssetsPage />
    </RequireModuleAccess>
  ),
});
