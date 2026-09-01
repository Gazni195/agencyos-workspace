import { useMemo } from "react";
import { Percent, PiggyBank, Target, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
import { leadStages } from "@/modules/leads/types";
import { money } from "@/shared/frontend/utils/money";
import { useLeadsStore } from "@/modules/leads/frontend/store/leadsStore";

export function LeadsReportPage() {
  const leads = useLeadsStore((s) => s.leads);
  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))), [leads]);

  const byStage = useMemo(
    () =>
      leadStages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        return {
          stage,
          count: stageLeads.length,
          value: stageLeads.reduce((s, l) => s + l.value, 0),
        };
      }),
    [leads],
  );

  const won = leads.filter((l) => l.stage === "Won");
  const lost = leads.filter((l) => l.stage === "Lost");
  const open = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");
  const winRate =
    won.length + lost.length ? Math.round((won.length / (won.length + lost.length)) * 100) : 0;
  const avgDealSize = won.length
    ? Math.round(won.reduce((s, l) => s + l.value, 0) / won.length)
    : 0;
  const pipelineValue = open.reduce((s, l) => s + l.value, 0);

  const bySource = useMemo(
    () =>
      sources
        .map((source) => {
          const sourceLeads = leads.filter((l) => l.source === source);
          return {
            source,
            count: sourceLeads.length,
            value: sourceLeads.reduce((s, l) => s + l.value, 0),
          };
        })
        .sort((a, b) => b.value - a.value),
    [leads, sources],
  );

  const byOwner = useMemo(
    () =>
      Array.from(new Set(leads.map((l) => l.owner)))
        .map((owner) => {
          const ownerLeads = leads.filter((l) => l.owner === owner);
          const ownerWon = ownerLeads.filter((l) => l.stage === "Won");
          return {
            owner,
            count: ownerLeads.length,
            value: ownerLeads.reduce((s, l) => s + l.value, 0),
            won: ownerWon.length,
          };
        })
        .filter((o) => o.count > 0)
        .sort((a, b) => b.value - a.value),
    [leads],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <ExportCsvButton
          filename="leads-report"
          rows={leads.map((l) => ({
            company: l.company,
            contact: l.contact,
            stage: l.stage,
            value: l.value,
            owner: l.owner,
            source: l.source,
            createdOn: l.createdOn,
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard
          label="Open pipeline"
          value={money(pipelineValue)}
          hint={`${open.length} leads`}
          icon={Target}
        />
        <KpiCard label="Win rate" value={`${winRate}%`} icon={Percent} />
        <KpiCard label="Avg. deal size" value={money(avgDealSize)} icon={PiggyBank} />
        <KpiCard label="Won this period" value={String(won.length)} icon={Trophy} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">Pipeline value by stage</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStage} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
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
                <Bar
                  dataKey="value"
                  name="Value"
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="font-semibold">By source</p>
          </div>
          <Table>
            <TableBody>
              {bySource.map((s) => (
                <TableRow key={s.source}>
                  <TableCell className="font-medium">{s.source}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{s.count}</TableCell>
                  <TableCell className="text-right font-semibold">{money(s.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">By owner</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Won</TableHead>
                <TableHead className="text-right">Pipeline value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byOwner.map((o) => (
                <TableRow key={o.owner}>
                  <TableCell className="font-medium">{o.owner}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{o.count}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{o.won}</TableCell>
                  <TableCell className="text-right font-semibold">{money(o.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
