import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, DollarSign, TrendingUp, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
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
  agingByClient,
  agingSummary,
  expenseCategoryTotals,
  financialTrend,
  invoiceTotal,
} from "@/data/finance";
import { money } from "@/data/agency";
import { useFinanceStore } from "@/store/financeStore";

export const Route = createFileRoute("/finance/")({
  head: () => ({
    meta: [
      { title: "Revenue — AgencyOS" },
      { name: "description", content: "Revenue, receivables and profit metrics for the agency." },
    ],
  }),
  component: FinanceRevenuePage,
});

const CATEGORY_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const AGING_KEYS = ["0-30", "31-60", "61-90", "90+"] as const;

function FinanceRevenuePage() {
  const invoices = useFinanceStore((s) => s.invoices);
  const expenses = useFinanceStore((s) => s.expenses);

  const revenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + invoiceTotal(i), 0);
  const receivables = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + invoiceTotal(i), 0);
  const totalExpenses = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + e.amount, 0);
  const profit = revenue - totalExpenses;
  const margin = revenue ? Math.round((profit / revenue) * 1000) / 10 : 0;
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  const aging = agingSummary();
  const categoryTotals = expenseCategoryTotals();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Revenue collected" value={money(revenue)} icon={DollarSign} />
        <KpiCard
          label="Receivables"
          value={money(receivables)}
          hint={`${overdueCount} overdue`}
          icon={Wallet}
        />
        <KpiCard label="Expenses" value={money(totalExpenses)} icon={AlertCircle} />
        <KpiCard
          label="Profit margin"
          value={`${margin}%`}
          hint={money(profit)}
          icon={TrendingUp}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Revenue, costs &amp; margin</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="finRevFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="finCostFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
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
                  formatter={(v: number, name: string) => (name === "margin" ? `${v}%` : money(v))}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-chart-1)"
                  fill="url(#finRevFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  name="Costs"
                  stroke="var(--color-chart-3)"
                  fill="url(#finCostFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Expenses by category</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {categoryTotals.map((c, i) => (
                    <Cell key={c.category} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => money(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {categoryTotals.map((c, i) => (
              <li key={c.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                  />
                  {c.category}
                </span>
                <span className="font-medium">{money(c.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Receivables aging by client</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingByClient} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="client"
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
                <Bar dataKey="0-30" name="0-30 days" stackId="age" fill="var(--color-chart-1)" />
                <Bar dataKey="31-60" name="31-60 days" stackId="age" fill="var(--color-chart-2)" />
                <Bar dataKey="61-90" name="61-90 days" stackId="age" fill="var(--color-chart-4)" />
                <Bar
                  dataKey="90+"
                  name="90+ days"
                  stackId="age"
                  fill="var(--color-chart-5)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Aging summary</p>
          <div className="space-y-3">
            {AGING_KEYS.map((bucket) => (
              <div key={bucket} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{bucket} days</span>
                <span className="font-semibold">{money(aging[bucket])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
