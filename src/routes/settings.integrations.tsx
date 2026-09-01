import { createFileRoute } from "@tanstack/react-router";
import { Plug } from "lucide-react";
import { Badge } from "@/shared/frontend/components/ui/badge";
import { Button } from "@/shared/frontend/components/ui/button";
import { useSettingsStore } from "@/modules/settings/frontend/store/settingsStore";

export const Route = createFileRoute("/settings/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — AgencyOS Settings" },
      { name: "description", content: "Connect AgencyOS to the tools your team already uses." },
    ],
  }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const integrations = useSettingsStore((s) => s.integrations);
  const toggleIntegration = useSettingsStore((s) => s.toggleIntegration);
  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div>
      <div className="surface-card mb-4 flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2">
          <Plug className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{connectedCount}</span> of{" "}
            {integrations.length} apps connected
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {integrations.map((i) => (
          <div key={i.id} className="surface-card flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{i.name}</p>
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {i.category}
                </Badge>
              </div>
              {i.connected && (
                <Badge className="border-success/25 bg-success/12 text-success">Connected</Badge>
              )}
            </div>
            <p className="flex-1 text-xs text-muted-foreground">{i.description}</p>
            <Button
              variant={i.connected ? "outline" : "default"}
              size="sm"
              onClick={() => toggleIntegration(i.id)}
            >
              {i.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
