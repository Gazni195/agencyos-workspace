import { createFileRoute } from "@tanstack/react-router";
import { GitBranch } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import { approverOptions, workflowEvents } from "@/data/workspace";

export const Route = createFileRoute("/settings/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — AgencyOS Settings" },
      { name: "description", content: "Configure who approves each agency workflow." },
    ],
  }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const workflowApprovers = useSettingsStore((s) => s.workflowApprovers);
  const setApprover = useSettingsStore((s) => s.setApprover);

  return (
    <div className="surface-card divide-y divide-border overflow-hidden">
      {workflowEvents.map((event) => (
        <div key={event} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
              <GitBranch className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">{event}</p>
              <p className="text-xs text-muted-foreground">
                Requires approval before it takes effect.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Approver</span>
            <Select value={workflowApprovers[event]} onValueChange={(v) => setApprover(event, v)}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {approverOptions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}
