import { useMemo, useState } from "react";
import { AlertTriangle, FileText, FolderOpen } from "lucide-react";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { FilterBar, type FilterDef } from "@/shared/frontend/components/FilterBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { documents, type EmployeeDocument } from "@/modules/employees/types";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";

export const categories = Array.from(new Set(documents.map((d) => d.category)));

export function DocumentsPage() {
  const employees = useEmployeesStore((s) => s.employees);
  const employeeById = (id: string) => employees.find((e) => e.id === id);
  const [category, setCategory] = useState("all");
  const needsAttention = documents.filter(
    (d) => d.status === "expiring" || d.status === "expired",
  ).length;

  const filtered = useMemo(
    () => documents.filter((d) => category === "all" || d.category === category),
    [category],
  );

  const filters: FilterDef[] = [
    {
      id: "category",
      label: "Category",
      value: category,
      onChange: setCategory,
      options: categories.map((c) => ({ label: c, value: c })),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Documents"
        description="Keep contracts, policies and employee files organized."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="All documents" value={String(documents.length)} icon={FileText} />
        <KpiCard label="Categories" value={String(categories.length)} icon={FolderOpen} />
        <KpiCard label="Needs attention" value={String(needsAttention)} icon={AlertTriangle} />
      </div>

      <div className="mt-5 mb-4">
        <FilterBar filters={filters} onReset={() => setCategory("all")} />
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc: EmployeeDocument) => {
                const emp = employeeById(doc.employeeId);
                return (
                  <TableRow key={doc.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <FileText className="size-4 text-muted-foreground" /> {doc.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {emp?.name ?? "Unknown"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{doc.category}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.uploadedOn}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.expiresOn ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
