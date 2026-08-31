import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign, CalendarDays, Receipt } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DrawerPanel } from "@/components/shared/DrawerPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employeeById, money, payrollTrend, type PayrollRun } from "@/data/agency";
import { useHrStore } from "@/store/hrStore";

export const Route = createFileRoute("/employees/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll — AgencyOS" },
      {
        name: "description",
        content: "Review payroll summaries, compensation and payslip status.",
      },
      { property: "og:title", content: "Payroll — AgencyOS" },
      {
        property: "og:description",
        content: "Review payroll summaries, compensation and payslip status.",
      },
    ],
  }),
  component: PayrollPage,
});

const statuses: PayrollRun["status"][] = ["paid", "processing", "on-hold"];

function PayrollPage() {
  const payroll = useHrStore((s) => s.payroll);
  const setPayrollStatus = useHrStore((s) => s.setPayrollStatus);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = payroll.find((p) => p.id === selectedId) ?? null;

  const total = payroll.reduce((sum, item) => sum + item.net, 0);

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader title="Payroll" description="Manage monthly payroll summaries and payslips." />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Net payroll" value={money(total)} icon={BadgeDollarSign} />
        <KpiCard label="Employees" value={String(payroll.length)} icon={Receipt} />
        <KpiCard label="Pay date" value="Aug 30, 2026" icon={CalendarDays} />
      </div>

      <div className="surface-card mt-5 p-5">
        <p className="mb-4 font-semibold">Payroll cost trend</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={payrollTrend} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="payrollFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
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
              <Area
                type="monotone"
                dataKey="cost"
                name="Payroll cost"
                stroke="var(--color-chart-1)"
                fill="url(#payrollFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payroll.map((p) => {
                const emp = employeeById(p.employeeId);
                return (
                  <TableRow
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{emp?.name ?? "Unknown"}</TableCell>
                    <TableCell className="text-muted-foreground">{money(p.base)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(p.bonus)}</TableCell>
                    <TableCell className="text-muted-foreground">-{money(p.deductions)}</TableCell>
                    <TableCell className="font-semibold">{money(p.net)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={p.status}
                        onValueChange={(v) => setPayrollStatus(p.id, v as PayrollRun["status"])}
                      >
                        <SelectTrigger
                          className="h-8 w-32"
                          aria-label={`Status for ${emp?.name ?? p.id}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s.replace("-", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <DrawerPanel
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected ? (employeeById(selected.employeeId)?.name ?? "Payslip") : "Payslip"}
        description={selected?.period}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base salary</span>
              <span className="font-medium">{money(selected.base)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bonus</span>
              <span className="font-medium">{money(selected.bonus)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Deductions</span>
              <span className="font-medium text-destructive">-{money(selected.deductions)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
              <span>Net pay</span>
              <span>{money(selected.net)}</span>
            </div>
            <div className="pt-2">
              <StatusBadge status={selected.status} />
            </div>
          </div>
        )}
      </DrawerPanel>
    </section>
  );
}
