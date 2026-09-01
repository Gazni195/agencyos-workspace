import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/frontend/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useProjectsStore } from "@/modules/projects/frontend/store/projectsStore";

const STATUS_COLORS: Record<string, string> = {
  "on-track": "var(--color-chart-1)",
  "at-risk": "var(--color-chart-4)",
  delayed: "var(--color-chart-3)",
};

export function ProjectHealthChart() {
  const deliveryProjects = useProjectsStore((s) => s.projects);
  const counts = deliveryProjects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).map(([status, count]) => ({ status, count }));

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle>Project health</CardTitle>
        <CardDescription>Status distribution across active projects</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((d) => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status] ?? "var(--color-chart-2)"} />
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
            <Legend wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
