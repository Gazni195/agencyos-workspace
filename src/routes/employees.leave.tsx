import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { leaveRequests } from "@/data/agency";

export const Route = createFileRoute("/employees/leave")({
  head: () => ({ meta: [{ title: "Leave Management — AgencyOS" }, { name: "description", content: "Review leave balances and employee time-off requests." }, { property: "og:title", content: "Leave Management — AgencyOS" }, { property: "og:description", content: "Review leave balances and employee time-off requests." }] }),
  component: LeavePage,
});

function LeavePage() {
  return <section className="mx-auto max-w-7xl"><PageHeader title="Leave management" description="Review requests, balances and upcoming time off." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard title="Pending requests" value={String(leaveRequests.filter((request) => request.status === "pending").length)} icon={Clock3} /><KpiCard title="Approved this month" value={String(leaveRequests.filter((request) => request.status === "approved").length)} icon={CheckCircle2} /><KpiCard title="Upcoming leave" value="12" icon={CalendarDays} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">Leave requests</p><p className="mt-2 text-sm text-muted-foreground">Requests are ready for approval and team planning.</p></div></section>;
}