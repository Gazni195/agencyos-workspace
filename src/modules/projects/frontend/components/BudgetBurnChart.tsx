import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BudgetBurnPoint } from "@/modules/projects/types";
import { money } from "@/shared/frontend/utils/money";

export function BudgetBurnChart({ data }: { data: BudgetBurnPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No budget burn data yet for this project.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="plannedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
          width={48}
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
        <Area
          type="monotone"
          dataKey="planned"
          name="Planned"
          stroke="var(--color-chart-2)"
          fill="url(#plannedFill)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="var(--color-chart-1)"
          fill="url(#actualFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
