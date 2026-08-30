import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, Timer } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { timesheetWeeklyHours } from "@/data/hr";

export const Route = createFileRoute("/employees/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — AgencyOS" }, { name: "description", content: "Review employee hours, utilization and timesheet submissions." }, { property: "og:title", content: "Timesheets — AgencyOS" }, { property: "og:description", content: "Review employee hours, utilization and timesheet submissions." }] }),
  component: TimesheetsPage,
});

function TimesheetsPage() {
  const billable = timesheetWeeklyHours.reduce((sum, week) => sum + week.billable, 0);
  return <section className="mx-auto max-w-7xl"><PageHeader title="Timesheets" description="Review submitted hours and billable utilization by week." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard label="Billable hours" value={`${billable}h`} icon={Timer} /><KpiCard label="Weeks tracked" value={String(timesheetWeeklyHours.length)} icon={CalendarClock} /><KpiCard label="Pending review" value="6" icon={CheckCircle2} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">Weekly hours</p><p className="mt-2 text-sm text-muted-foreground">Timesheet submissions are ready for project and payroll review.</p></div></section>;
}