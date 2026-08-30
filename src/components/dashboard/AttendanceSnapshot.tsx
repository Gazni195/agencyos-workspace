import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { attendance, attendanceTrend } from "@/data/agency";
import { Link } from "@tanstack/react-router";

export function AttendanceSnapshot() {
  const today = { present: 0, remote: 0, late: 0, absent: 0 } as Record<string, number>;
  for (const a of attendance) today[a.status] = (today[a.status] ?? 0) + 1;

  const stats = [
    { label: "Present", value: today["present"], tone: "text-success" },
    { label: "Remote", value: today["remote"], tone: "text-info" },
    { label: "Late", value: today["late"], tone: "text-warning" },
    { label: "Absent", value: today["absent"], tone: "text-destructive" },
  ];

  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Attendance today</CardTitle>
          <CardDescription>Live headcount snapshot</CardDescription>
        </div>
        <Link to="/employees" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <p className={`text-xl font-bold ${s.tone}`}>{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceTrend}>
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="present" name="Present" stackId="a" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="remote" name="Remote" stackId="a" fill="var(--color-chart-2)" />
              <Bar dataKey="absent" name="Absent" stackId="a" fill="var(--color-chart-4)" radius={[0, 0, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
