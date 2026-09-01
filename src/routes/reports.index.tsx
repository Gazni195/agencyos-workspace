import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, TrendingUp, Users, Wallet } from "lucide-react";
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
  computeClientHealthDistribution,
  computeClientRetention,
  computeClientRevenue,
  computeFinancialTrend,
  computeReceivablesTrend,
} from "@/modules/reports/frontend/services/financeReportsService";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Revenue Report — AgencyOS" },
      { name: "description", content: "Revenue, receivables and client health analytics." },
    ],
  }),
  component: RevenueReportPage,
});

const HEALTH_COLORS: Record<string, string> = {
  Healthy: "var(--color-chart-1)",
  "At Risk": "var(--color-chart-4)",
  "Churn Risk": "var(--color-chart-5)",
};

function RevenueReportPage() {
  const invoices = useFinanceStore((s) => s.invoices);
  const expenses = useFinanceStore((s) => s.expenses);
  const clients = useClientsStore((s) => s.clients);

  const financialTrend = computeFinancialTrend(invoices, expenses);
  const receivablesTrend = computeReceivablesTrend(invoices);
  const clientHealthDistribution = computeClientHealthDistribution(clients);
  const clientRevenue = computeClientRevenue(clients);
  const clientRetention = computeClientRetention(clients);

  const totalRevenue = financialTrend.reduce((s, r) => s + r.revenue, 0);
  const avgMargin = financialTrend.length
    ? Math.round((financialTrend.reduce((s, r) => s + r.margin, 0) / financialTrend.length) * 10) /
      10
    : 0;
  const latestReceivables = receivablesTrend[receivablesTrend.length - 1]?.receivables ?? 0;
  const atRiskClients = clientHealthDistribution.find((h) => h.health !== "Healthy")?.value ?? 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <ExportCsvButton
          filename="client-revenue-report"
          rows={clientRevenue.map((c) => {
            const retention = clientRetention.find((r) => r.client === c.client);
            return {
              client: c.client,
              revenue: c.revenue,
              tenureMonths: retention?.tenureMonths ?? "",
              renewalProbability: retention?.renewalProbability ?? "",
              mrr: retention?.mrr ?? "",
            };
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard label="Revenue (6mo)" value={money(totalRevenue)} icon={DollarSign} />
        <KpiCard label="Avg. margin" value={`${avgMargin}%`} icon={TrendingUp} />
        <KpiCard label="Receivables" value={money(latestReceivables)} icon={Wallet} />
        <KpiCard label="Clients needing attention" value={String(atRiskClients)} icon={Users} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Revenue vs. costs</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="repRevFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
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
                  formatter={(v: number) => money(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--color-chart-1)"
                  fill="url(#repRevFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  name="Costs"
                  stroke="var(--color-chart-3)"
                  fillOpacity={0}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <p className="mb-4 font-semibold">Client health</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientHealthDistribution}
                  dataKey="value"
                  nameKey="health"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {clientHealthDistribution.map((h) => (
                    <Cell key={h.health} fill={HEALTH_COLORS[h.health] ?? "var(--color-chart-2)"} />
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
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Receivables trend</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={receivablesTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
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
                  formatter={(v: number) => money(v)}
                />
                <Bar
                  dataKey="receivables"
                  name="Receivables"
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="font-semibold">Top clients by revenue</p>
          </div>
          <div className="max-h-56 overflow-y-auto">
            <Table>
              <TableBody>
                {[...clientRevenue]
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((c) => (
                    <TableRow key={c.client}>
                      <TableCell className="font-medium">{c.client}</TableCell>
                      <TableCell className="text-right font-semibold">{money(c.revenue)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Client retention</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Renewal probability</TableHead>
                <TableHead className="text-right">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientRetention.map((c) => (
                <TableRow key={c.client}>
                  <TableCell className="font-medium">{c.client}</TableCell>
                  <TableCell className="text-muted-foreground">{c.tenureMonths} months</TableCell>
                  <TableCell className="text-muted-foreground">{c.renewalProbability}%</TableCell>
                  <TableCell className="text-right font-semibold">{money(c.mrr)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
