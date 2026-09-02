import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock3, UserCheck, UserX } from "lucide-react";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { attendance, attendanceTrend } from "@/modules/employees/types";
import { generateMonthCalendar, monthLabel, type DayStatus } from "@/modules/employees/types";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { cn } from "@/shared/frontend/utils/utils";

export const Route = createFileRoute("/employees/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — AgencyOS" },
      { name: "description", content: "Monitor agency attendance, check-ins and absences." },
      { property: "og:title", content: "Attendance — AgencyOS" },
      { property: "og:description", content: "Monitor agency attendance, check-ins and absences." },
    ],
  }),
  component: AttendancePage,
});

const dayClass: Record<DayStatus, string> = {
  present: "bg-success/70",
  remote: "bg-info/70",
  late: "bg-warning/70",
  leave: "bg-primary/60",
  absent: "bg-destructive/70",
  weekend: "bg-muted",
  none: "bg-transparent",
};

function AttendancePage() {
  const employees = useEmployeesStore((s) => s.employees);
  const employeeById = (id: string) => employees.find((e) => e.id === id);
  const present = attendance.filter((record) => record.status === "present").length;
  const remote = attendance.filter((record) => record.status === "remote").length;
  const late = attendance.filter((record) => record.status === "late").length;
  const absent = attendance.filter((record) => record.status === "absent").length;
  const daysInMonth = 30;

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Attendance"
        description={`Track headcount and attendance trends for ${monthLabel}.`}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Present" value={String(present)} icon={UserCheck} />
        <KpiCard label="Remote" value={String(remote)} icon={CalendarCheck} />
        <KpiCard label="Late check-ins" value={String(late)} icon={Clock3} />
        <KpiCard label="Absent" value={String(absent)} icon={UserX} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Today's check-ins</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Clock in</TableHead>
                  <TableHead>Clock out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => {
                  const emp = employeeById(record.employeeId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px]">
                            {emp?.initials ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        {emp?.name ?? "Unknown"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.clockIn}</TableCell>
                      <TableCell className="text-muted-foreground">{record.clockOut}</TableCell>
                      <TableCell className="text-muted-foreground">{record.hours}h</TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Weekly trend</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
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
                  dataKey="present"
                  name="Present"
                  stackId="a"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="remote" name="Remote" stackId="a" fill="var(--color-chart-2)" />
                <Bar dataKey="absent" name="Absent" stackId="a" fill="var(--color-chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 p-5">
        <p className="mb-4 font-semibold">Team calendar — {monthLabel}</p>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[160px_repeat(30,1fr)] gap-0.5">
              <div />
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div key={i} className="text-center text-[10px] text-muted-foreground">
                  {i + 1}
                </div>
              ))}
              {employees.map((emp, seed) => {
                const pattern = generateMonthCalendar(seed, daysInMonth);
                return (
                  <Fragment key={emp.id}>
                    <div className="truncate py-0.5 pr-2 text-xs font-medium">{emp.name}</div>
                    {pattern.map((status, day) => (
                      <div
                        key={`${emp.id}-${day}`}
                        title={`${emp.name} — ${status} — Aug ${day + 1}`}
                        className={cn("aspect-square rounded-[3px]", dayClass[status])}
                      />
                    ))}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {(Object.keys(dayClass) as DayStatus[])
            .filter((s) => s !== "none")
            .map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={cn("size-2.5 rounded-sm", dayClass[s])} />
                {s}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
