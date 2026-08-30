import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarCheck2,
  CheckSquare,
  FolderKanban,
  Receipt,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { ProjectHealthChart } from "@/components/dashboard/ProjectHealthChart";
import { TeamUtilizationChart } from "@/components/dashboard/TeamUtilizationChart";
import { AttendanceSnapshot } from "@/components/dashboard/AttendanceSnapshot";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { InboxPreview } from "@/components/dashboard/InboxPreview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getDashboardKpis, type DashboardKpi } from "@/services/dashboardService";
import { currentUser } from "@/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgencyOS" },
      {
        name: "description",
        content: "Executive overview of revenue, pipeline, delivery and team health.",
      },
    ],
  }),
  component: Index,
});

const kpiIcons: Record<DashboardKpi["id"], LucideIcon> = {
  "revenue-mtd": Wallet,
  "active-clients": Building2,
  "active-projects": FolderKanban,
  employees: Users,
  "attendance-today": CalendarCheck2,
  "pending-tasks": CheckSquare,
  "open-leads": Target,
  receivables: Receipt,
};

function Index() {
  const kpis = getDashboardKpis();

  return (
    <div>
      <PageHeader
        title="Overview"
        description={`Welcome back, ${currentUser.name.split(" ")[0]} — here's what's happening across the agency.`}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.id}
            to={kpi.to}
            className="block transition-transform hover:-translate-y-0.5"
          >
            <KpiCard
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              hint={kpi.hint}
              icon={kpiIcons[kpi.id] ?? Wallet}
            />
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <ProjectHealthChart />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <PipelineChart />
        <TeamUtilizationChart />
        <AttendanceSnapshot />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <RecentActivity />
        <UpcomingDeadlines />
        <PendingApprovals />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <InboxPreview />
        <QuickActions />
      </div>
    </div>
  );
}
