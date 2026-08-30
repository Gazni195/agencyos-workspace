import { createFileRoute } from "@tanstack/react-router";
import { Award, Gauge, Target } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { employeeGoals } from "@/data/hr";

export const Route = createFileRoute("/employees/performance")({
  head: () => ({ meta: [{ title: "Performance — AgencyOS" }, { name: "description", content: "Track employee goals, reviews and performance progress." }, { property: "og:title", content: "Performance — AgencyOS" }, { property: "og:description", content: "Track employee goals, reviews and performance progress." }] }),
  component: PerformancePage,
});

function PerformancePage() {
  const average = Math.round(employeeGoals.reduce((sum, goal) => sum + goal.progress, 0) / (employeeGoals.length || 1));
  return <section className="mx-auto max-w-7xl"><PageHeader title="Performance" description="Keep goals, reviews and development conversations moving." /><div className="grid gap-4 sm:grid-cols-3"><KpiCard title="Active goals" value={String(employeeGoals.length)} icon={Target} /><KpiCard title="Average progress" value={`${average}%`} icon={Gauge} /><KpiCard title="Reviews due" value="8" icon={Award} /></div><div className="surface-card mt-5 p-5"><p className="font-semibold">Team performance</p><p className="mt-2 text-sm text-muted-foreground">Goal progress and review cycles are ready for manager updates.</p></div></section>;
}