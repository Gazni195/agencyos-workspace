import { createFileRoute } from "@tanstack/react-router";
import { Award, CalendarCheck, Clock, UserX } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { ExportCsvButton } from "@/modules/reports/frontend/components/ExportCsvButton";
import { attendanceTrend, departmentAttendance } from "@/modules/reports/types";
import { performanceByDept } from "@/modules/employees/types";

export const Route = createFileRoute("/reports/employees")({
  head: () => ({
    meta: [
      { title: "Employee Reports — AgencyOS" },
      { name: "description", content: "Attendance, performance and utilization by department." },
    ],
  }),
  component: EmployeesReportPage,
});

function EmployeesReportPage() {
  const avgAttendance = departmentAttendance.length
    ? Math.round(
        departmentAttendance.reduce((s, d) => s + d.attendanceRate, 0) /
          departmentAttendance.length,
      )
    : 0;
  const avgHours = departmentAttendance.length
    ? Math.round(
        (departmentAttendance.reduce((s, d) => s + d.avgHours, 0) / departmentAttendance.length) *
          10,
      ) / 10
    : 0;
  const totalLate = departmentAttendance.reduce((s, d) => s + d.lateArrivals, 0);
  const avgScore = performanceByDept.length
    ? Math.round(
        (performanceByDept.reduce((s, d) => s + d.score, 0) / performanceByDept.length) * 10,
      ) / 10
    : 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <ExportCsvButton
          filename="employee-department-report"
          rows={departmentAttendance.map((d) => ({
            department: d.department,
            attendanceRate: d.attendanceRate,
            avgHours: d.avgHours,
            lateArrivals: d.lateArrivals,
            performanceScore:
              performanceByDept.find((p) => p.department === d.department)?.score ?? "",
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Avg. attendance" value={`${avgAttendance}%`} icon={CalendarCheck} />
        <KpiCard label="Avg. hours/day" value={`${avgHours}h`} icon={Clock} />
        <KpiCard label="Late arrivals (6wk)" value={String(totalLate)} icon={UserX} />
        <KpiCard label="Avg. performance" value={avgScore.toFixed(1)} icon={Award} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Weekly attendance trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
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
                  dataKey="present"
                  name="Present"
                  stackId="a"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="late" name="Late" stackId="a" fill="var(--color-chart-4)" />
                <Bar dataKey="absent" name="Absent" stackId="a" fill="var(--color-chart-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Performance score by department</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByDept} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
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
                  angle={-25}
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
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Department detail</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
                <TableHead className="text-right">Avg. hours</TableHead>
                <TableHead className="text-right">Late arrivals</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentAttendance.map((d) => (
                <TableRow key={d.department}>
                  <TableCell className="font-medium">{d.department}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {d.attendanceRate}%
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{d.avgHours}h</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {d.lateArrivals}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {performanceByDept
                      .find((p) => p.department === d.department)
                      ?.score.toFixed(1) ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
