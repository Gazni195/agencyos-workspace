import { Link } from "@tanstack/react-router";
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
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { RevenueChart } from "@/modules/dashboard/frontend/components/RevenueChart";
import { PipelineChart } from "@/modules/dashboard/frontend/components/PipelineChart";
import { ProjectHealthChart } from "@/modules/dashboard/frontend/components/ProjectHealthChart";
import { TeamUtilizationChart } from "@/modules/dashboard/frontend/components/TeamUtilizationChart";
import { AttendanceSnapshot } from "@/modules/dashboard/frontend/components/AttendanceSnapshot";
import { RecentActivity } from "@/modules/dashboard/frontend/components/RecentActivity";
import { UpcomingDeadlines } from "@/modules/dashboard/frontend/components/UpcomingDeadlines";
import { PendingApprovals } from "@/modules/dashboard/frontend/components/PendingApprovals";
import { InboxPreview } from "@/modules/dashboard/frontend/components/InboxPreview";
import { QuickActions } from "@/modules/dashboard/frontend/components/QuickActions";
import {
  getDashboardKpis,
  type DashboardKpi,
} from "@/modules/dashboard/frontend/services/dashboardService";
import { useCurrentUser } from "@/shared/frontend/hooks/useCurrentUser";

export const kpiIcons: Record<DashboardKpi["id"], LucideIcon> = {
  "revenue-mtd": Wallet,
  "active-clients": Building2,
  "active-projects": FolderKanban,
  employees: Users,
  "attendance-today": CalendarCheck2,
  "pending-tasks": CheckSquare,
  "open-leads": Target,
  receivables: Receipt,
};

export function Index() {
  const kpis = getDashboardKpis();
  const currentUser = useCurrentUser();

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
