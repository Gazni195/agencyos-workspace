import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Briefcase, Users, Trash2 } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EditDepartmentDialog,
  EditDesignationDialog,
  EditIconButton,
  NewDepartmentDialog,
  NewDesignationDialog,
} from "@/components/settings/OrganizationDialogs";
import { useSettingsStore } from "@/store/settingsStore";
import { useEmployeesStore } from "@/store/employeesStore";
import { toast } from "sonner";

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
  const departments = useSettingsStore((s) => s.departments);
  const addDepartment = useSettingsStore((s) => s.addDepartment);
  const updateDepartment = useSettingsStore((s) => s.updateDepartment);
  const removeDepartment = useSettingsStore((s) => s.removeDepartment);
  const designations = useSettingsStore((s) => s.designations);
  const addDesignation = useSettingsStore((s) => s.addDesignation);
  const updateDesignation = useSettingsStore((s) => s.updateDesignation);
  const removeDesignation = useSettingsStore((s) => s.removeDesignation);
  const employees = useEmployeesStore((s) => s.employees);

  const [editDeptId, setEditDeptId] = useState<string | null>(null);
  const [deleteDeptId, setDeleteDeptId] = useState<string | null>(null);
  const [editDesigId, setEditDesigId] = useState<string | null>(null);
  const [deleteDesigId, setDeleteDesigId] = useState<string | null>(null);

  const editingDept = departments.find((d) => d.id === editDeptId) ?? null;
  const deletingDept = departments.find((d) => d.id === deleteDeptId) ?? null;
  const editingDesig = designations.find((d) => d.id === editDesigId) ?? null;
  const deletingDesig = designations.find((d) => d.id === deleteDesigId) ?? null;

  const headcount = (departmentName: string) =>
    employees.filter((e) => e.department === departmentName).length;
  const totalHeadcount = employees.length;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Departments" value={String(departments.length)} icon={Building2} />
        <KpiCard label="Designations" value={String(designations.length)} icon={Briefcase} />
        <KpiCard label="Total headcount" value={String(totalHeadcount)} icon={Users} />
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <p className="font-semibold">Departments</p>
          <NewDepartmentDialog onCreate={addDepartment} />
        </div>
        {departments.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No departments yet. Add one to start organizing your team.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead className="text-right">Headcount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-muted-foreground">{d.head}</TableCell>
                    <TableCell className="text-right font-semibold">{headcount(d.name)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <EditIconButton onClick={() => setEditDeptId(d.id)} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
                          aria-label={`Delete ${d.name}`}
                          onClick={() => setDeleteDeptId(d.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <p className="font-semibold">Designations</p>
          <NewDesignationDialog departments={departments} onCreate={addDesignation} />
        </div>
        {designations.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No designations yet. Add one so it can be assigned when creating employees.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.title}</TableCell>
                    <TableCell className="text-muted-foreground">{d.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <EditIconButton onClick={() => setEditDesigId(d.id)} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
                          aria-label={`Delete ${d.title}`}
                          onClick={() => setDeleteDesigId(d.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {editingDept && (
        <EditDepartmentDialog
          department={editingDept}
          open={!!editDeptId}
          onOpenChange={(open) => !open && setEditDeptId(null)}
          onSave={(patch) => updateDepartment(editingDept.id, patch)}
        />
      )}
      <DeleteConfirmDialog
        open={!!deletingDept}
        onOpenChange={(open) => !open && setDeleteDeptId(null)}
        title={`Delete ${deletingDept?.name}?`}
        description="Employees already assigned to this department keep the name on their record, but it won't be selectable for new assignments."
        onConfirm={() => {
          if (!deletingDept) return;
          removeDepartment(deletingDept.id);
          toast.success(`${deletingDept.name} deleted`);
          setDeleteDeptId(null);
        }}
      />

      {editingDesig && (
        <EditDesignationDialog
          designation={editingDesig}
          departments={departments}
          open={!!editDesigId}
          onOpenChange={(open) => !open && setEditDesigId(null)}
          onSave={(patch) => updateDesignation(editingDesig.id, patch)}
        />
      )}
      <DeleteConfirmDialog
        open={!!deletingDesig}
        onOpenChange={(open) => !open && setDeleteDesigId(null)}
        title={`Delete ${deletingDesig?.title}?`}
        description="This removes it from the designation catalog used when adding employees."
        onConfirm={() => {
          if (!deletingDesig) return;
          removeDesignation(deletingDesig.id);
          toast.success(`${deletingDesig.title} deleted`);
          setDeleteDesigId(null);
        }}
      />
    </div>
  );
}
