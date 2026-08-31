import { createFileRoute } from "@tanstack/react-router";
import { Building2, Briefcase, Users } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { departmentsSeed, designationsSeed } from "@/data/workspace";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "Organization — AgencyOS Settings" },
      { name: "description", content: "Departments and designations across the agency." },
    ],
  }),
  component: OrganizationPage,
});

function OrganizationPage() {
  const totalHeadcount = departmentsSeed.reduce((s, d) => s + d.headcount, 0);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Departments" value={String(departmentsSeed.length)} icon={Building2} />
        <KpiCard label="Designations" value={String(designationsSeed.length)} icon={Briefcase} />
        <KpiCard label="Total headcount" value={String(totalHeadcount)} icon={Users} />
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Departments</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Head</TableHead>
                <TableHead className="text-right">Headcount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentsSeed.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="text-muted-foreground">{d.head}</TableCell>
                  <TableCell className="text-right font-semibold">{d.headcount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="border-b border-border p-5">
          <p className="font-semibold">Designations</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designationsSeed.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell className="text-muted-foreground">{d.department}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{d.level}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
