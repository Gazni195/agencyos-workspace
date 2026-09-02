import { AlertTriangle, ClipboardList, TrendingUp, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
import { money } from "@/shared/frontend/utils/money";
import { useFinanceStore } from "@/modules/finance/frontend/store/financeStore";
import { useClientsStore } from "@/modules/clients/frontend/store/clientsStore";
import {
  computeAgingByClient,
  computeAgingSummary,
  computeExpenseCategoryTotals,
  computeFinancialTrend,
} from "@/modules/reports/frontend/services/financeReportsService";

export const CATEGORY_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function FinanceReportPage() {
  const invoices = useFinanceStore((s) => s.invoices);
  const expenses = useFinanceStore((s) => s.expenses);
  const clients = useClientsStore((s) => s.clients);

  const agingByClient = computeAgingByClient(invoices, clients);
  const aging = computeAgingSummary(agingByClient);
  const financialTrend = computeFinancialTrend(invoices, expenses);
  const agingChartData = [
    { bucket: "0-30", amount: aging["0-30"] },
    { bucket: "31-60", amount: aging["31-60"] },
    { bucket: "61-90", amount: aging["61-90"] },
    { bucket: "90+", amount: aging["90+"] },
  ];
  const totalReceivables = agingChartData.reduce((s, b) => s + b.amount, 0);
  const overdue = aging["90+"];

  const categoryTotals = computeExpenseCategoryTotals(expenses);
  const totalExpenses = categoryTotals.reduce((s, c) => s + c.amount, 0);

  const avgMargin = financialTrend.length
    ? Math.round((financialTrend.reduce((s, r) => s + r.margin, 0) / financialTrend.length) * 10) /
      10
    : 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <ExportCsvButton
          filename="finance-aging-report"
          rows={agingByClient.map((row) => ({
            client: row.client,
            "0-30": row["0-30"],
            "31-60": row["31-60"],
            "61-90": row["61-90"],
            "90+": row["90+"],
            total: row["0-30"] + row["31-60"] + row["61-90"] + row["90+"],
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Total receivables" value={money(totalReceivables)} icon={Wallet} />
        <KpiCard label="90+ days overdue" value={money(overdue)} icon={AlertTriangle} />
        <KpiCard
          label="Total expenses (period)"
          value={money(totalExpenses)}
          icon={ClipboardList}
        />
        <KpiCard label="Avg. margin" value={`${avgMargin}%`} icon={TrendingUp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Profit &amp; margin trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
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
                  yAxisId="left"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                  width={48}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
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
                  formatter={(v: number, name: string) => (name === "Margin" ? `${v}%` : money(v))}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="costs"
                  name="Costs"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="margin"
                  name="Margin"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Expense mix</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
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
          <ul className="mt-3 space-y-1.5 text-xs">
            {categoryTotals.map((c, i) => (
              <li key={c.category} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-2 shrink-0 rounded-full"
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
          <p className="mb-4 font-semibold">Receivables aging</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingChartData} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="bucket"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
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
                <Bar dataKey="amount" name="Receivables" radius={[6, 6, 0, 0]}>
                  {agingChartData.map((b) => (
                    <Cell
                      key={b.bucket}
                      fill={b.bucket === "90+" ? "var(--color-chart-5)" : "var(--color-chart-2)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="font-semibold">Expense categories</p>
          </div>
          <Table>
            <TableBody>
              {[...categoryTotals]
                .sort((a, b) => b.amount - a.amount)
                .map((c) => (
                  <TableRow key={c.category}>
                    <TableCell className="font-medium">{c.category}</TableCell>
                    <TableCell className="text-right font-semibold">{money(c.amount)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Aging by client</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">0-30</TableHead>
                <TableHead className="text-right">31-60</TableHead>
                <TableHead className="text-right">61-90</TableHead>
                <TableHead className="text-right">90+</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingByClient.map((row) => {
                const total = row["0-30"] + row["31-60"] + row["61-90"] + row["90+"];
                return (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {money(row["0-30"])}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {money(row["31-60"])}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {money(row["61-90"])}
                    </TableCell>
                    <TableCell
                      className={`text-right ${row["90+"] > 0 ? "font-semibold text-destructive" : "text-muted-foreground"}`}
                    >
                      {money(row["90+"])}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{money(total)}</TableCell>
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
