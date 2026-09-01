import { Award, Gauge, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { Progress } from "@/shared/frontend/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { employeeGoals, performance, performanceByDept } from "@/modules/employees/types";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";

export function PerformancePage() {
  const employees = useEmployeesStore((s) => s.employees);
  const employeeById = (id: string) => employees.find((e) => e.id === id);
  const average = Math.round(
    employeeGoals.reduce((sum, goal) => sum + goal.progress, 0) / (employeeGoals.length || 1),
  );
  const reviewsDue = performance.filter((p) => p.status !== "completed").length;

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Performance"
        description="Keep goals, reviews and development conversations moving."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Active goals" value={String(employeeGoals.length)} icon={Target} />
        <KpiCard label="Average progress" value={`${average}%`} icon={Gauge} />
        <KpiCard label="Reviews due" value={String(reviewsDue)} icon={Award} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Performance reviews</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.map((p) => {
                  const emp = employeeById(p.employeeId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{emp?.name ?? "Unknown"}</TableCell>
                      <TableCell className="text-muted-foreground">{p.cycle}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.score > 0 ? p.score.toFixed(1) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.goalsMet}/{p.goalsTotal}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.reviewer}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Score by department</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceByDept}
                margin={{ left: -12, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="department"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  domain={[0, 5]}
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="score"
                  name="Score"
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 p-5">
        <p className="mb-4 font-semibold">Employee goals</p>
        <div className="space-y-4">
          {employeeGoals.map((goal) => {
            const emp = employeeById(goal.employeeId);
            return (
              <div key={goal.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {goal.title}{" "}
                    <span className="font-normal text-muted-foreground">— {emp?.name}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {goal.progress}% · due {goal.dueDate}
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
