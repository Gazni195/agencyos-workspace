import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, DollarSign, FolderKanban, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/common/KpiCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExportCsvButton } from "@/components/reports/ExportCsvButton";
import { money } from "@/data/agency";
import { useProjectsStore } from "@/store/projectsStore";
import {
  computeOnTimeDeliveryRate,
  computeProjectBudgetActual,
  computeProjectStatusDistribution,
} from "@/services/financeReportsService";

export const Route = createFileRoute("/reports/projects")({
  head: () => ({
    meta: [
      { title: "Project Reports — AgencyOS" },
      { name: "description", content: "Delivery status, budget variance and on-time performance." },
    ],
  }),
  component: ProjectsReportPage,
});

const STATUS_COLORS: Record<string, string> = {
  "On Track": "var(--color-chart-1)",
  "At Risk": "var(--color-chart-4)",
  Delayed: "var(--color-chart-5)",
};

function ProjectsReportPage() {
  const projects = useProjectsStore((s) => s.projects);
  const projectStatusDistribution = computeProjectStatusDistribution(projects);
  const projectBudgetActual = computeProjectBudgetActual(projects);
  const onTimeDeliveryRate = computeOnTimeDeliveryRate(projects);

  const totalProjects = projectStatusDistribution.reduce((s, d) => s + d.value, 0);
  const totalBudget = projectBudgetActual.reduce((s, p) => s + p.budget, 0);
  const totalActual = projectBudgetActual.reduce((s, p) => s + p.actual, 0);
  const variance = totalActual - totalBudget;

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <ExportCsvButton
          filename="project-budget-report"
          rows={projectBudgetActual.map((p) => ({
            project: p.name,
            budget: p.budget,
            actual: p.actual,
            variance: p.actual - p.budget,
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Active projects" value={String(totalProjects)} icon={FolderKanban} />
        <KpiCard label="On-time delivery" value={`${onTimeDeliveryRate}%`} icon={CheckCircle2} />
        <KpiCard label="Total budget" value={money(totalBudget)} icon={DollarSign} />
        <KpiCard label="Budget variance" value={money(variance)} icon={TrendingDown} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Budget vs. actual by project</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectBudgetActual}
                margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => money(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="budget"
                  name="Budget"
                  fill="var(--color-chart-2)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  name="Actual"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Status distribution</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusDistribution}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {projectStatusDistribution.map((d) => (
                    <Cell key={d.status} fill={STATUS_COLORS[d.status] ?? "var(--color-chart-3)"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Budget detail</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectBudgetActual.map((p) => {
                const v = p.actual - p.budget;
                return (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {money(p.budget)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {money(p.actual)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${v > 0 ? "text-destructive" : "text-success"}`}
                    >
                      {v > 0 ? "+" : ""}
                      {money(v)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
