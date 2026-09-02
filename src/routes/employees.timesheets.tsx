import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Clock, Percent } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { Badge } from "@/shared/frontend/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { useHrStore } from "@/modules/employees/frontend/store/hrStore";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import { TimesheetFormDialog } from "@/modules/employees/frontend/components/TimesheetFormDialog";

export const Route = createFileRoute("/employees/timesheets")({
  head: () => ({
    meta: [
      { title: "Timesheets — AgencyOS" },
      { name: "description", content: "Review submitted hours and billable utilization." },
      { property: "og:title", content: "Timesheets — AgencyOS" },
      { property: "og:description", content: "Review submitted hours and billable utilization." },
    ],
  }),
  component: TimesheetsPage,
});

// Groups by the Monday of each entry's week — data/hr.ts's
// timesheetWeeklyHours used to be a static, permanently-empty snapshot
// (same bug class fixed for finance/reports aggregates in an earlier
// phase); real timesheet entries already carry real dates via
// hrStore.addTimesheet, so this can be honestly computed live instead.
function weekStartOf(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function computeWeeklyHours(timesheets: { date: string; hours: number; billable: boolean }[]) {
  const weeks = new Map<string, { billable: number; nonBillable: number }>();
  for (const t of timesheets) {
    const key = weekStartOf(t.date);
    const entry = weeks.get(key) ?? { billable: 0, nonBillable: 0 };
    if (t.billable) entry.billable += t.hours;
    else entry.nonBillable += t.hours;
    weeks.set(key, entry);
  }
  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      week: new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...v,
    }));
}

function TimesheetsPage() {
  const employees = useEmployeesStore((s) => s.employees);
  const employeeById = (id: string) => employees.find((e) => e.id === id);
  const timesheets = useHrStore((s) => s.timesheets);
  const addTimesheet = useHrStore((s) => s.addTimesheet);
  const projects = useProjectsStore((s) => s.projects);
  const tasks = useTasksStore((s) => s.tasks);
  const clients = useClientsStore((s) => s.clients);
  const projectById = (id: string) => projects.find((p) => p.id === id);
  const taskById = (id: string) => tasks.find((t) => t.id === id);
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? "Unknown client";

  const totalHours = timesheets.reduce((sum, t) => sum + t.hours, 0);
  const billableHours = timesheets.filter((t) => t.billable).reduce((sum, t) => sum + t.hours, 0);
  const billablePct = totalHours ? Math.round((billableHours / totalHours) * 100) : 0;
  const pendingApproval = timesheets.filter((t) => t.status === "submitted").length;
  const timesheetWeeklyHours = computeWeeklyHours(timesheets);

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Timesheets"
        description="Review logged hours, billability and approvals."
        actions={<TimesheetFormDialog onCreate={addTimesheet} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Hours logged" value={`${totalHours}h`} icon={Clock} />
        <KpiCard label="Billable" value={`${billablePct}%`} icon={Percent} />
        <KpiCard label="Awaiting approval" value={String(pendingApproval)} icon={CheckSquare} />
      </div>

      <div className="surface-card mt-5 p-5">
        <p className="mb-4 font-semibold">Weekly billable vs. non-billable hours</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timesheetWeeklyHours}
              margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="billable"
                name="Billable"
                stackId="a"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="nonBillable"
                name="Non-billable"
                stackId="a"
                fill="var(--color-chart-3)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((t) => {
                const emp = employeeById(t.employeeId);
                const project = projectById(t.projectId);
                const task = t.taskId ? taskById(t.taskId) : undefined;
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{emp?.name ?? "Unknown"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {project ? clientName(project.clientId) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{project?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{task?.title ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="font-medium">{t.hours}h</TableCell>
                    <TableCell>
                      <Badge variant={t.billable ? "default" : "secondary"}>
                        {t.billable ? "Billable" : "Internal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
