import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CalendarCog, ShieldCheck } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Switch } from "@/components/ui/switch";
import { attendancePolicies, approvalWorkflows } from "@/data/hr";
import { notificationEvents } from "@/data/workspace";

export const Route = createFileRoute("/employees/settings")({
  head: () => ({
    meta: [
      { title: "Employee Settings — AgencyOS" },
      {
        name: "description",
        content: "Configure attendance, leave and employee workflow settings.",
      },
      { property: "og:title", content: "Employee Settings — AgencyOS" },
      {
        property: "og:description",
        content: "Configure attendance, leave and employee workflow settings.",
      },
    ],
  }),
  component: EmployeeSettingsPage,
});

function EmployeeSettingsPage() {
  const [policies, setPolicies] = useState(attendancePolicies);
  const [notifications, setNotifications] = useState(
    () => new Set(notificationEvents.filter((_, i) => i % 3 !== 2)),
  );

  const enabledCount = policies.filter((p) => p.enabled).length;

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Employee settings"
        description="Configure HR policies, approval workflows and notifications."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Attendance policies"
          value={`${enabledCount}/${policies.length}`}
          icon={CalendarCog}
        />
        <KpiCard
          label="Approval workflows"
          value={String(approvalWorkflows.length)}
          icon={ShieldCheck}
        />
        <KpiCard
          label="Notification rules"
          value={`${notifications.size}/${notificationEvents.length}`}
          icon={BellRing}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Attendance policies</p>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{policy.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{policy.description}</p>
                </div>
                <Switch
                  checked={policy.enabled}
                  onCheckedChange={(checked) =>
                    setPolicies((prev) =>
                      prev.map((p) => (p.id === policy.id ? { ...p, enabled: checked } : p)),
                    )
                  }
                  aria-label={policy.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Approval workflows</p>
          <div className="space-y-3">
            {approvalWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <p className="text-sm font-medium">{wf.label}</p>
                <p className="text-xs text-muted-foreground">Approver: {wf.approver}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 p-5">
        <p className="mb-4 font-semibold">Notification rules</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {notificationEvents.map((event) => (
            <div
              key={event}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <p className="text-sm">{event}</p>
              <Switch
                checked={notifications.has(event)}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => {
                    const next = new Set(prev);
                    if (checked) next.add(event);
                    else next.delete(event);
                    return next;
                  })
                }
                aria-label={event}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
