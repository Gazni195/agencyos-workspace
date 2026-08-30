import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CalendarCog, ShieldCheck } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/employees/settings")({
  head: () => ({ meta: [{ title: "Employee Settings — AgencyOS" }, { name: "description", content: "Configure attendance, leave and employee workflow settings." }, { property: "og:title", content: "Employee Settings — AgencyOS" }, { property: "og:description", content: "Configure attendance, leave and employee workflow settings." }] }),
  component: EmployeeSettingsPage,
});

function EmployeeSettingsPage() {
  return <section className="mx-auto max-w-7xl"><PageHeader title="Employee settings" description="Configure HR policies, approval workflows and notifications." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard title="Attendance policies" value="4" icon={CalendarCog} /><KpiCard title="Approval workflows" value="4" icon={ShieldCheck} /><KpiCard title="Notification rules" value="8" icon={BellRing} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">HR workspace settings</p><p className="mt-2 text-sm text-muted-foreground">Policies and workflows are ready for configuration.</p></div></section>;
}