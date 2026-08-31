import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { BellRing, CalendarCog, ShieldCheck, Trash2 } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { EditIconButton } from "@/components/settings/OrganizationDialogs";
import { NewLeaveTypeDialog, EditLeaveTypeDialog } from "@/components/settings/LeaveTypeDialogs";
import { useSettingsStore } from "@/store/settingsStore";
import { notificationEvents, workflowEvents } from "@/data/workspace";

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
  const policies = useSettingsStore((s) => s.attendancePolicies);
  const toggleAttendancePolicy = useSettingsStore((s) => s.toggleAttendancePolicy);
  const workflowApprovers = useSettingsStore((s) => s.workflowApprovers);
  const notificationPrefs = useSettingsStore((s) => s.notificationPrefs);
  const toggleNotificationPref = useSettingsStore((s) => s.toggleNotificationPref);
  const leaveTypes = useSettingsStore((s) => s.leaveTypes);
  const addLeaveType = useSettingsStore((s) => s.addLeaveType);
  const updateLeaveType = useSettingsStore((s) => s.updateLeaveType);
  const removeLeaveType = useSettingsStore((s) => s.removeLeaveType);

  const [editLeaveTypeId, setEditLeaveTypeId] = useState<string | null>(null);
  const [deleteLeaveTypeId, setDeleteLeaveTypeId] = useState<string | null>(null);
  const editingLeaveType = leaveTypes.find((t) => t.id === editLeaveTypeId) ?? null;
  const deletingLeaveType = leaveTypes.find((t) => t.id === deleteLeaveTypeId) ?? null;

  const enabledCount = policies.filter((p) => p.enabled).length;
  const enabledNotifications = notificationEvents.filter((e) => notificationPrefs[e]).length;

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
        <KpiCard label="Leave types" value={String(leaveTypes.length)} icon={ShieldCheck} />
        <KpiCard
          label="Notification rules"
          value={`${enabledNotifications}/${notificationEvents.length}`}
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
                  onCheckedChange={() => toggleAttendancePolicy(policy.id)}
                  aria-label={policy.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Approval workflows</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Shared with Settings → Workflows — change the approver there.
          </p>
          <div className="space-y-3">
            {workflowEvents.map((event) => (
              <div
                key={event}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <p className="text-sm font-medium">{event}</p>
                <p className="text-xs text-muted-foreground">
                  Approver: {workflowApprovers[event]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <p className="font-semibold">Leave types</p>
            <p className="text-xs text-muted-foreground">
              The catalog offered when filtering or requesting leave.
            </p>
          </div>
          <NewLeaveTypeDialog existingCount={leaveTypes.length} onCreate={addLeaveType} />
        </div>
        <div className="divide-y divide-border">
          {leaveTypes.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.annualAllowance} days/year
                  {t.carryOver ? " · carries over" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <EditIconButton onClick={() => setEditLeaveTypeId(t.id)} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
                  aria-label={`Delete ${t.name}`}
                  onClick={() => setDeleteLeaveTypeId(t.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
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
                checked={notificationPrefs[event] ?? false}
                onCheckedChange={() => toggleNotificationPref(event)}
                aria-label={event}
              />
            </div>
          ))}
        </div>
      </div>

      {editingLeaveType && (
        <EditLeaveTypeDialog
          leaveType={editingLeaveType}
          open={!!editLeaveTypeId}
          onOpenChange={(open) => !open && setEditLeaveTypeId(null)}
          onSave={(patch) => updateLeaveType(editingLeaveType.id, patch)}
        />
      )}
      <DeleteConfirmDialog
        open={!!deletingLeaveType}
        onOpenChange={(open) => !open && setDeleteLeaveTypeId(null)}
        title={`Delete ${deletingLeaveType?.name}?`}
        description="This removes it from the leave type catalog. Existing leave requests keep their recorded type."
        onConfirm={() => {
          if (!deletingLeaveType) return;
          removeLeaveType(deletingLeaveType.id);
          toast.success(`${deletingLeaveType.name} deleted`);
          setDeleteLeaveTypeId(null);
        }}
      />
    </section>
  );
}
