import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserCheck, CalendarClock, Gauge, Plus } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataToolbar } from "@/components/common/DataToolbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Employee, type EmployeeStatus } from "@/data/agency.ts";
import { useEmployeesStore } from "@/store/employeesStore";
import { useSettingsStore } from "@/store/settingsStore";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

export const Route = createFileRoute("/employees/")({
  head: () => ({
    meta: [
      { title: "Employee Directory — AgencyOS" },
      { name: "description", content: "Browse and manage every employee in your agency." },
      { property: "og:title", content: "Employee Directory — AgencyOS" },
      { property: "og:description", content: "Browse and manage every employee in your agency." },
    ],
  }),
  component: DirectoryPage,
});

const ALL = "all";

function DirectoryPage() {
  const employeeList = useEmployeesStore((s) => s.employees);
  const addEmployee = useEmployeesStore((s) => s.addEmployee);
  const departments = useSettingsStore((s) => s.departments);
  const designations = useSettingsStore((s) => s.designations);
  const { can } = usePermissions();
  const canEdit = can("Employees", "edit");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [employmentType, setEmploymentType] = useState<string>(ALL);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    manager: "",
    employmentType: "Full-time",
  });

  const filtered = useMemo(() => {
    return employeeList.filter((e) => {
      const matchesQuery =
        query.trim() === "" ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.role.toLowerCase().includes(query.toLowerCase()) ||
        e.email.toLowerCase().includes(query.toLowerCase());
      const matchesDept = department === ALL || e.department === department;
      const matchesStatus = status === ALL || e.status === status;
      const matchesType = employmentType === ALL || e.employmentType === employmentType;
      return matchesQuery && matchesDept && matchesStatus && matchesType;
    });
  }, [employeeList, query, department, status, employmentType]);

  const headcount = employeeList.length;
  const active = employeeList.filter((e) => e.status === "active").length;
  const onLeave = employeeList.filter((e) => e.status === "on-leave").length;
  const avgUtilization = Math.round(
    employeeList.reduce((sum, e) => sum + e.utilization, 0) / (employeeList.length || 1),
  );

  function handleAdd() {
    if (!form.name.trim() || !form.role.trim() || !form.department || !form.email.trim()) {
      toast.error("Please fill name, role, department and email.");
      return;
    }
    const initials = form.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: form.name,
      initials,
      role: form.role,
      department: form.department,
      email: form.email,
      phone: "—",
      location: "—",
      employmentType: form.employmentType as Employee["employmentType"],
      status: "probation" as EmployeeStatus,
      manager: form.manager || "Unassigned",
      joinedOn: new Date().toISOString().slice(0, 10),
      salary: 0,
      utilization: 0,
      leaveBalance: 0,
      skills: [],
    };
    addEmployee(newEmployee);
    setOpen(false);
    setForm({
      name: "",
      role: "",
      department: "",
      email: "",
      manager: "",
      employmentType: "Full-time",
    });
    toast.success(`${newEmployee.name} added to the directory`);
  }

  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Headcount" value={String(headcount)} icon={Users} hint="Total employees" />
        <KpiCard label="Active" value={String(active)} icon={UserCheck} hint="Currently working" />
        <KpiCard
          label="On Leave"
          value={String(onLeave)}
          icon={CalendarClock}
          hint="Away right now"
        />
        <KpiCard
          label="Avg. Utilization"
          value={`${avgUtilization}%`}
          icon={Gauge}
          hint="Across team"
        />
      </div>

      <DataToolbar query={query} onQueryChange={setQuery} placeholder="Search name, role or email…">
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="h-10 w-40 rounded-xl bg-card">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-36 rounded-xl bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
            <SelectItem value="probation">Probation</SelectItem>
            <SelectItem value="offboarding">Offboarding</SelectItem>
          </SelectContent>
        </Select>
        <Select value={employmentType} onValueChange={setEmploymentType}>
          <SelectTrigger className="h-10 w-40 rounded-xl bg-card">
            <SelectValue placeholder="Employment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-10 gap-1.5 rounded-xl"
              disabled={!canEdit}
              title={canEdit ? undefined : "Your role doesn't have edit access to Employees"}
            >
              <Plus className="size-4" /> Add employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="emp-name">Full name</Label>
                <Input
                  id="emp-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jordan Wells"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-role">Role</Label>
                <Input
                  id="emp-role"
                  list="emp-role-suggestions"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Brand Designer"
                />
                <datalist id="emp-role-suggestions">
                  {designations.map((d) => (
                    <option key={d.id} value={d.title} />
                  ))}
                </datalist>
                {designations.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add designations in Settings → Organization for suggestions here.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-dept">Department</Label>
                  <Select
                    value={form.department}
                    onValueChange={(v) => setForm({ ...form, department: v })}
                    disabled={departments.length === 0}
                  >
                    <SelectTrigger id="emp-dept">
                      <SelectValue
                        placeholder={
                          departments.length === 0 ? "Add one in Settings" : "Select department"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-type">Employment type</Label>
                  <Select
                    value={form.employmentType}
                    onValueChange={(v) => setForm({ ...form, employmentType: v })}
                  >
                    <SelectTrigger id="emp-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-email">Email</Label>
                <Input
                  id="emp-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jordan.wells@agencyos.co"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-manager">Manager</Label>
                <Input
                  id="emp-manager"
                  value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                  placeholder="Daniel Reyes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="surface-card overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id} className="cursor-pointer">
                <TableCell>
                  <Link
                    to="/employees/$employeeId"
                    params={{ employeeId: e.id }}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary-soft text-xs font-semibold text-accent-foreground">
                        {e.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.role}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{e.department}</TableCell>
                <TableCell className="text-muted-foreground">{e.email}</TableCell>
                <TableCell>
                  <StatusBadge status={e.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={e.utilization} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{e.utilization}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{e.manager}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No employees match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
