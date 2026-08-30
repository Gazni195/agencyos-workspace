import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock3, UserCheck } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { attendance } from "@/data/agency";

export const Route = createFileRoute("/employees/attendance")({
  head: () => ({ meta: [{ title: "Attendance — AgencyOS" }, { name: "description", content: "Monitor agency attendance, check-ins and absences." }, { property: "og:title", content: "Attendance — AgencyOS" }, { property: "og:description", content: "Monitor agency attendance, check-ins and absences." }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const present = attendance.filter((record) => record.status === "present").length;
  const remote = attendance.filter((record) => record.status === "remote").length;
  return <section className="mx-auto max-w-7xl"><PageHeader title="Attendance" description="Track today's headcount and attendance trends." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard title="Present" value={String(present)} icon={UserCheck} /><KpiCard title="Remote" value={String(remote)} icon={CalendarCheck} /><KpiCard title="Late check-ins" value={String(attendance.filter((record) => record.status === "late").length)} icon={Clock3} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">Today's attendance</p><p className="mt-2 text-sm text-muted-foreground">Check-in records are ready for manager review.</p></div></section>;
}