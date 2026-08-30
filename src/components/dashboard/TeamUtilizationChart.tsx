import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { departments, employees } from "@/data/agency";

const barColor = (utilization: number) => {
  if (utilization >= 80) return "var(--color-chart-1)";
  if (utilization >= 60) return "var(--color-chart-2)";
  return "var(--color-chart-4)";
};

export function TeamUtilizationChart() {
  const data = departments.map((department) => {
    const members = employees.filter((e) => e.department === department);
    const utilization = members.length
      ? Math.round(members.reduce((sum, e) => sum + e.utilization, 0) / members.length)
      : 0;
    return { department, utilization, headcount: members.length };
  });

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle>Team utilization</CardTitle>
        <CardDescription>Average billable utilization by department</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="department"
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
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v}%`, "Utilization"]}
            />
            <Bar dataKey="utilization" name="Utilization" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.department} fill={barColor(d.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
