import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money } from "@/data/agency";
import { leadStages } from "@/data/crm";
import { useLeadsStore } from "@/store/leadsStore";
import { Link } from "@tanstack/react-router";

export function PipelineChart() {
  const leads = useLeadsStore((s) => s.leads);
  const pipeline = leadStages
    .filter((stage) => stage !== "Won" && stage !== "Lost")
    .map((stage) => ({
      stage,
      value: leads.filter((l) => l.stage === stage).reduce((sum, l) => sum + l.value, 0),
    }));

  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Pipeline by stage</CardTitle>
          <CardDescription>Open opportunity value</CardDescription>
        </div>
        <Link to="/leads" className="text-xs font-medium text-primary hover:underline">
          View leads
        </Link>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pipeline} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="stage"
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
              tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
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
            <Bar dataKey="value" name="Value" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
